import Image from "next/image";

export default function HighlightCard() {
  return (
    <section className="rounded-[12px] border border-[#EDEDED] bg-white p-6">
      <h2 className="text-2xl font-bold">Highlight</h2>

      <div className="mt-6 flex flex-col gap-8 rounded-[28px] border border-[#EDEDED] p-6 md:flex-row md:items-center">
        <div className="flex flex-1 justify-center bg-[#F4F4F4] p-10">
          <Image
            src="/image-placeholder.png"
            alt="Highlight placeholder"
            width={260}
            height={180}
            className="h-auto w-full max-w-[260px]"
          />
        </div>

        <div className="flex-1">
          <h3 className="text-2xl font-bold">Title</h3>
          <p className="mt-4 text-lg text-[#747474]">Subtitle</p>
        </div>
      </div>
    </section>
  );
}
