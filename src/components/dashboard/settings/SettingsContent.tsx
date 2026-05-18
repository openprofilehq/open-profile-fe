import { Bell, Lock, UserRound } from "lucide-react";

const settings = [
  {
    title: "Account Information",
    description: "Update your personal details and profile information.",
    icon: UserRound,
  },
  {
    title: "Password & Security",
    description: "Manage your password and account security settings.",
    icon: Lock,
  },
  {
    title: "Notifications",
    description: "Choose how you want to receive dashboard updates.",
    icon: Bell,
  },
];

export default function SettingsContent() {
  return (
    <div className="mx-auto w-full max-w-[920px]">
      <div>
        <h1 className="text-3xl font-bold text-[#050505]">Settings</h1>
        <p className="mt-2 text-[#747474]">
          Manage your account preferences and profile settings.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        {settings.map((item) => {
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

              <button className="rounded-[8px] border border-[#EDEDED] px-4 py-2 text-sm font-medium text-[#050505]">
                Edit
              </button>
            </section>
          );
        })}
      </div>
    </div>
  );
}
