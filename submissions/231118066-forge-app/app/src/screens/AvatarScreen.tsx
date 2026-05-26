/**
 * AvatarScreen.tsx
 *
 * Kendi .glb avatarını render eder.
 * expo-speech ile konuşturur, viseme animasyonu simüle eder.
 * react-three-fiber Expo'da tam destek vermediğinden
 * expo-gl + three.js direkt kullanılır.
 */

import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  Alert,
  TextInput,
} from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import * as Speech from 'expo-speech';
import { Asset } from 'expo-asset';
import { AuditWidget } from '../audit/AuditWidget';
import { AuditReport } from '../audit/types';

interface Props {
  onBack: () => void;
  onExpertCall: () => void;
}

// Viseme mouth-open levels mapped to phoneme groups
const VISEME_MAP: Record<string, number> = {
  silence: 0,
  open: 0.8,
  mid: 0.5,
  closed: 0.1,
};

export const AvatarScreen: React.FC<Props> = ({ onBack, onExpertCall }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [inputText, setInputText] = useState('Merhaba! Ben senin avatarınım.');
  const mouthAnim = useRef(new Animated.Value(0)).current;
  const animLoopRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Animate mouth open/close while speaking
  const startMouthAnim = useCallback(() => {
    let open = false;
    animLoopRef.current = setInterval(() => {
      Animated.timing(mouthAnim, {
        toValue: open ? 0.8 : 0.1,
        duration: 120,
        useNativeDriver: false,
      }).start();
      open = !open;
    }, 150);
  }, [mouthAnim]);

  const stopMouthAnim = useCallback(() => {
    if (animLoopRef.current) clearInterval(animLoopRef.current);
    Animated.timing(mouthAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [mouthAnim]);

  const speak = useCallback(async () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
      stopMouthAnim();
      return;
    }
    setIsSpeaking(true);
    startMouthAnim();
    Speech.speak(inputText, {
      language: 'tr-TR',
      pitch: 1.0,
      rate: 0.9,
      onDone: () => {
        setIsSpeaking(false);
        stopMouthAnim();
      },
      onError: () => {
        setIsSpeaking(false);
        stopMouthAnim();
      },
    });
  }, [isSpeaking, inputText, startMouthAnim, stopMouthAnim]);

  useEffect(() => {
    return () => {
      Speech.stop();
      if (animLoopRef.current) clearInterval(animLoopRef.current);
    };
  }, []);

  // expo-gl 3D scene setup
  const onContextCreate = useCallback(async (gl: any) => {
    const renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    renderer.setClearColor(0x0a0a14);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      100,
    );
    camera.position.set(0, 1.6, 2.5);
    camera.lookAt(0, 1.4, 0);

    // Ambient + directional light
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(1, 3, 2);
    scene.add(dirLight);

    // Load avatar GLB
    let avatarMesh: THREE.Group | null = null;
    try {
      const asset = Asset.fromModule(require('../../assets/avatar.glb'));
      await asset.downloadAsync();
      const { GLTFLoader } = await import(
        'three/examples/jsm/loaders/GLTFLoader'
      );
      const loader = new (GLTFLoader as any)();
      loader.load(
        asset.localUri,
        (gltf: any) => {
          avatarMesh = gltf.scene;
          if (avatarMesh) {
            avatarMesh.position.set(0, 0, 0);
            avatarMesh.scale.set(1, 1, 1);
            scene.add(avatarMesh);
          }
        },
        undefined,
        (err: any) => console.warn('GLB load error', err),
      );
    } catch (e) {
      // Fallback: simple head sphere if GLB fails
      const geo = new THREE.SphereGeometry(0.4, 32, 32);
      const mat = new THREE.MeshStandardMaterial({ color: 0xf4c2a1 });
      const head = new THREE.Mesh(geo, mat);
      head.position.set(0, 1.4, 0);
      scene.add(head);

      // Mouth
      const mouthGeo = new THREE.SphereGeometry(0.05, 16, 16);
      const mouthMat = new THREE.MeshStandardMaterial({ color: 0x8b0000 });
      const mouth = new THREE.Mesh(mouthGeo, mouthMat);
      mouth.position.set(0, 1.25, 0.38);
      scene.add(mouth);

      // Animate mouth via mouthAnim
      mouthAnim.addListener(({ value }) => {
        mouth.scale.y = 1 + value * 3;
      });
    }

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (avatarMesh) avatarMesh.rotation.y = Math.sin(Date.now() / 3000) * 0.1;
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    animate();

    return () => cancelAnimationFrame(frameId);
  }, [mouthAnim]);

  const handleReport = (r: AuditReport) => console.log('[AvatarScreen] audit:', r.id);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🪞 Avatar</Text>
        <TouchableOpacity onPress={onExpertCall} style={styles.expertBtn}>
          <Text style={styles.expertBtnText}>📞 Uzman</Text>
        </TouchableOpacity>
      </View>

      {/* 3D Avatar */}
      <View style={styles.glContainer}>
        <GLView style={styles.glView} onContextCreate={onContextCreate} />

        {/* Mouth overlay indicator */}
        <Animated.View
          style={[
            styles.mouthIndicator,
            {
              height: mouthAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [4, 20],
              }),
              opacity: isSpeaking ? 1 : 0.3,
            },
          ]}
        />
      </View>

      {/* Text input */}
      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          multiline
          placeholder="Avatar ne söylesin?"
          placeholderTextColor="#555"
        />
        <TouchableOpacity
          style={[styles.speakBtn, isSpeaking && styles.speakBtnActive]}
          onPress={speak}
        >
          <Text style={styles.speakBtnText}>
            {isSpeaking ? '⏹ Durdur' : '🗣️ Konuştur'}
          </Text>
        </TouchableOpacity>
      </View>

      <AuditWidget screenName="Avatar" onReport={handleReport} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0a0a14' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 8,
  },
  backBtn: { paddingHorizontal: 8, paddingVertical: 4 },
  backText: { color: '#7b8cde', fontSize: 15, fontWeight: '600' },
  title: { flex: 1, fontSize: 18, fontWeight: '800', color: '#fff' },
  expertBtn: {
    backgroundColor: '#b71c1c',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  expertBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  glContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glView: { width: '100%', flex: 1 },
  mouthIndicator: {
    position: 'absolute',
    bottom: 12,
    width: 40,
    backgroundColor: '#ce93d8',
    borderRadius: 4,
  },
  inputArea: {
    padding: 16,
    paddingBottom: 80,
    gap: 10,
  },
  input: {
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    padding: 12,
    color: '#fff',
    fontSize: 14,
    minHeight: 60,
    borderWidth: 1,
    borderColor: '#333',
    textAlignVertical: 'top',
  },
  speakBtn: {
    backgroundColor: '#1a237e',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3949ab',
  },
  speakBtnActive: {
    backgroundColor: '#7b1fa2',
    borderColor: '#ce93d8',
  },
  speakBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
