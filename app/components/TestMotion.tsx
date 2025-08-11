import { useEffect } from "react";
import { animate } from "motion";

export function TestMotion() {
  useEffect(() => {
    // シンプルなフェードインアニメーション
    animate(
      ".test-element",
      { opacity: [0, 1], y: [20, 0] },
      { duration: 1 }
    );
  }, []);

  return (
    <div className="p-8 bg-gray-900 text-white">
      <h2 className="text-2xl mb-4">Motion Test</h2>
      <div className="test-element opacity-0">
        <p>This text should animate in!</p>
      </div>
    </div>
  );
} 