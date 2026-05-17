import Image from "next/image";

export default function ProfileSummaryCard() {
  return (
    <section className="flex flex-col gap-5 rounded-[12px] border border-[#EDEDED] bg-white p-6 md:flex-row md:items-start">
      <Image
        src="/avatar.png"
        alt="Profile avatar"
        width={96}
        height={96}
        className="h-24 w-24 rounded-full object-cover"
      />

      <div>
        <h2 className="text-3xl font-bold">Micaela, Robinsonss</h2>
        <p className="mt-4 max-w-[650px] text-xl leading-8 text-[#050505]">
          I&apos;m a digital creator focusing on the intersection of design,
          technology, and intentional living. Sharing insights to help you build
          better products and habits.
        </p>
      </div>
    </section>
  );
}
