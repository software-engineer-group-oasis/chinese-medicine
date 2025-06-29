import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

interface Herb3DProps {
  modelName: string; // 例如 "阳春砂"
}

const modelMap: Record<string, string> = {
  '黄连': '/3d-models/黄柏.glb',
  '三七': '/3d-models/鹿茸.glb',
  '麻黄': '/3d-models/麻黄.glb',
  // 其他模型名与文件名映射
};

function HerbModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={2.5} />;
}

const Herb3D: React.FC<Herb3DProps> = ({ modelName }) => {
  // 优先查找映射，没有则用默认拼接
  const url = modelMap[modelName] || `/3d-models/${modelName}.glb`;
  const [exists, setExists] = useState<boolean>(false);

  useEffect(() => {
    let ignore = false;
    // 检查模型文件是否存在
    fetch(url, { method: 'HEAD' })
      .then(res => {
        if (!ignore) setExists(res.ok);
      })
      .catch(() => {
        if (!ignore) setExists(false);
      });
    return () => { ignore = true; };
  }, [url]);

  if (!exists) return null;
  return (
    <div style={{ width: 320, height: 320, background: '#6bb89e', borderRadius: 12 }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 40 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Suspense fallback={null}>
          <HerbModel url={url} />
        </Suspense>
        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  );
};

export default Herb3D;

