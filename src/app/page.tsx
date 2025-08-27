"use client";
import { Board } from "@/components/board/Board";
import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

function HomeContent() {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Verificar se voltou do modo tela cheia e deve centralizar no paper
    const paperId = searchParams.get('paper');
    const shouldCenter = searchParams.get('center');
    
    if (paperId && shouldCenter === 'true') {
      console.log('Centralizando no paper:', paperId);
      // Aqui você pode implementar a lógica para centralizar o Canvas no paper
      // Por exemplo, emitir um evento customizado que o Board pode escutar
      window.dispatchEvent(new CustomEvent('centerOnPaper', { detail: { paperId } }));
    }
  }, [searchParams]);

  return <Board />;
}

export default function Home() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <HomeContent />
    </Suspense>
  );
}
