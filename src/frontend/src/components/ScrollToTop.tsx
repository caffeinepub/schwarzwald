import { useRouter } from "@tanstack/react-router";
import { useEffect } from "react";

export default function ScrollToTop() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = router.subscribe("onResolved", () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    });

    return () => {
      unsubscribe();
    };
  }, [router]);

  return null;
}
