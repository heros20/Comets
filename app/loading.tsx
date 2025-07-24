import CometsLoader from "@/components/CometsLoader";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <CometsLoader />
      <div className="mt-4 text-orange-600 font-bold text-xl animate-pulse">
        Chargement du site…
      </div>
    </div>
  );
}
