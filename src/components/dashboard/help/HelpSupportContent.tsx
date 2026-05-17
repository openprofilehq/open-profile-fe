import { Mail, MessageCircleQuestion, ShieldQuestion } from "lucide-react";

const supportItems = [
  {
    title: "FAQs",
    description: "Find answers to common questions and platform guidance.",
    icon: MessageCircleQuestion,
  },
  {
    title: "Contact Support",
    description: "Reach out to our support team for direct assistance.",
    icon: Mail,
  },
  {
    title: "Privacy & Security",
    description: "Learn how we protect your account and personal data.",
    icon: ShieldQuestion,
  },
];

export default function HelpSupportContent() {
  return (
    <div className="mx-auto w-full max-w-[920px]">
      <div>
        <h1 className="text-3xl font-bold text-[#050505]">Help and Support</h1>

        <p className="mt-2 text-[#747474]">
          Need assistance? Explore help resources and contact support.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        {supportItems.map((item) => {
          const Icon = item.icon;

          return (
            <section
              key={item.title}
              className="flex items-center justify-between rounded-[12px] border border-[#EDEDED] bg-white p-5"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-[#E5F4F6] text-[#087583]">
                  <Icon size={22} />
                </span>

                <div>
                  <h2 className="text-lg font-bold text-[#050505]">
                    {item.title}
                  </h2>

                  <p className="mt-1 text-[#747474]">{item.description}</p>
                </div>
              </div>

              <a
                href="mailto:support@openprofile.com"
                className="rounded-[8px] border border-[#EDEDED] px-4 py-2 text-sm font-medium text-[#050505]"
              >
                Open
              </a>
            </section>
          );
        })}
      </div>
    </div>
  );
}
