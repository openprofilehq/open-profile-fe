import { Button } from "../ui/button";

const STEP_CLASSES =
  "border-2 border-[#C3E2E5] flex justify-center items-center rounded-full text-brand font-bold";

export default function ProgressBar({
  currentStep,
  onUpdateStep,
}: {
  currentStep: number;
  onUpdateStep: () => void;
}) {
  return (
    <div className="absolute -top-7 right-0 left-0 mt-20 flex flex-col">
      <div
        className={`${currentStep === 3 ? "hidden" : "flex"} mt-10 w-full items-center justify-center`}
      >
        <div
          className={`${STEP_CLASSES} ${currentStep === 1 ? "h-14 w-14 text-[28px]" : "h-8 w-8 text-[20px]"}`}
        >
          1
        </div>

        <span className="relative bottom-1 mx-4 h-4 w-20 border-b-2 border-b-[#8C8F98]" />

        <div
          className={`${STEP_CLASSES} ${currentStep === 2 ? "h-16 w-16 text-[28px]" : "h-10 w-10 text-[20px]"}`}
        >
          2
        </div>
      </div>

      {currentStep !== 3 && (
        <p className="relative top-7 mb-10 text-center text-2xl font-bold text-[#747474]">
          {currentStep === 1
            ? "Put your skills on display"
            : "What do you want people to know about you?"}
        </p>
      )}

      {currentStep === 2 && (
        <Button
          type="button"
          variant="secondary"
          className="flex items-center justify-end bg-transparent text-right hover:bg-transparent xl:w-250"
          onClick={onUpdateStep}
        >
          Skip &raquo;
        </Button>
      )}
    </div>
  );
}
