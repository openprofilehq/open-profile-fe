"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CTA } from "@/components/home/CTA";
import { Mail, Phone, MapPin, ChevronDown } from "lucide-react";
import { contactAction } from "@/app/actions/contact";
import { Button } from "@/components/ui/button";
import { validateFullName } from "@/utils/nameValidation";

const XIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="opacity-70 transition-opacity hover:opacity-100"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="opacity-70 transition-opacity hover:opacity-100"
  >
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const socials = [
  { label: "X", href: "https://x.com/OpenProfilehq", icon: <XIcon /> },
  {
    label: "Instagram",
    href: "https://instagram.com/openprofilehq",
    icon: <InstagramIcon />,
  },
];

const industries = [
  "Technology",
  "Design",
  "Marketing",
  "Finance",
  "Healthcare",
  "Education",
  "Other",
];

const contactSchema = z.object({
  name: z.string().superRefine((val, ctx) => {
    const err = validateFullName(val);
    if (err) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: err,
      });
    }
  }),
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Incorrect email format."),
  industry: z.string().optional(),
  message: z
    .string()
    .min(1, "Message is required.")
    .max(450, "Message cannot exceed 450 characters."),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const contactResolver = async (values: ContactFormValues) => {
  const result = await contactSchema.safeParseAsync(values);
  if (result.success) {
    return { values: result.data, errors: {} };
  }

  const errors = result.error.issues.reduce(
    (
      acc: Record<string, { type: string; message: string }>,
      current: z.ZodIssue
    ) => {
      const path = current.path[0] as string;
      return {
        ...acc,
        [path]: {
          type: current.code,
          message: current.message,
        },
      };
    },
    {}
  );

  return { values: {}, errors };
};

export default function ContactPage() {
  const [success, setSuccess] = useState(false);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<ContactFormValues>({
    resolver: contactResolver,
    defaultValues: {
      name: "",
      email: "",
      industry: "",
      message: "",
    },
    mode: "onTouched",
  });

  const industry = watch("industry");
  const messageVal = watch("message") || "";
  const characterCount = messageVal.length;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function onSubmit(data: ContactFormValues) {
    setPending(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      if (data.industry) {
        formData.append("industry", data.industry);
      }
      formData.append("message", data.message);

      const result = await contactAction(undefined, formData);
      if (result?.error) {
        toast.error(result.error);
      } else if (result?.success) {
        setSuccess(true);
        reset();
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="selection:bg-brand text-primary-text min-h-screen overflow-hidden bg-white font-sans selection:text-white">
      <div className="pt-[76px]">
        <main className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
          {/* Header */}
          <div className="mb-16 text-center">
            <h1 className="mb-3 text-[32px] font-semibold tracking-tight md:text-[40px]">
              Get in Touch With Us
            </h1>
            <p className="text-secondary-text text-[14px] md:text-[15px]">
              No matter where you are, Open Profile brings solutions closer to
              you.
            </p>
          </div>

          {/* Two-column layout */}
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-16 md:grid-cols-2">
            {/* Left — Contact info */}
            <div className="space-y-10">
              <div>
                <h2 className="mb-6 text-[18px] font-semibold">Contact Us</h2>
                <ul className="space-y-5">
                  <li className="flex items-start gap-3">
                    <Mail
                      size={18}
                      className="text-link-hover-text mt-0.5 shrink-0"
                    />
                    <div>
                      <p className="text-primary-text text-[13px] font-medium">
                        Email Address
                      </p>
                      <p className="text-secondary-text text-[13px]">
                        openprofile@email.com
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Phone
                      size={18}
                      className="text-link-hover-text mt-0.5 shrink-0"
                    />
                    <div>
                      <p className="text-primary-text text-[13px] font-medium">
                        Phone number
                      </p>
                      <p className="text-secondary-text text-[13px]">
                        +1 234 567 8900
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin
                      size={18}
                      className="text-link-hover-text mt-0.5 shrink-0"
                    />
                    <div>
                      <p className="text-primary-text text-[13px] font-medium">
                        Our Office Address
                      </p>
                      <p className="text-secondary-text text-[13px]">
                        New York, USA
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Socials */}
              <div>
                <p className="text-primary-text mb-2 text-[20px] font-medium">
                  Follow us on our social media accounts
                </p>
                <div className="flex items-center gap-4">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      aria-label={s.label}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary-text hover:text-brand block transition-colors"
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — Form */}
            <div>
              <h2 className="mb-6 text-[18px] font-semibold">Send a Message</h2>

              {success ? (
                <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                  <div className="bg-brand-subtle-bg flex h-14 w-14 items-center justify-center rounded-full">
                    <Mail size={24} className="text-brand" />
                  </div>
                  <h3 className="text-primary-text text-[17px] font-semibold">
                    Message Sent!
                  </h3>
                  <p className="text-secondary-text max-w-xs text-[13px]">
                    Thanks for reaching out. We&apos;ll get back to you as soon
                    as possible.
                  </p>
                  <Button
                    onClick={() => setSuccess(false)}
                    className="mt-2 hover:underline"
                  >
                    Send another message
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                  className="space-y-5"
                >
                  <input type="hidden" {...register("industry")} />

                  <div className="space-y-1.5">
                    <label
                      htmlFor="name"
                      className="text-primary-text text-[13px] font-medium"
                    >
                      Name <span className="text-negative-text">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Shukuneh Itouer"
                      {...register("name")}
                      className={`placeholder:text-disabled-text w-full rounded-[8px] border px-4 py-3 text-[13px] transition focus:ring-2 focus:outline-none ${
                        errors.name
                          ? "border-negative-text focus:ring-negative-text"
                          : "border-input-b focus:ring-brand focus:border-transparent"
                      }`}
                    />
                    {errors.name?.message && (
                      <p className="text-negative-text mt-1 text-xs">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="email"
                      className="text-primary-text text-[13px] font-medium"
                    >
                      Email <span className="text-negative-text">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="shukuneh025@gmail.com"
                      {...register("email")}
                      className={`placeholder:text-disabled-text w-full rounded-[8px] border px-4 py-3 text-[13px] transition focus:ring-2 focus:outline-none ${
                        errors.email
                          ? "border-negative-text focus:ring-negative-text"
                          : "border-input-b focus:ring-brand focus:border-transparent"
                      }`}
                    />
                    {errors.email?.message && (
                      <p className="text-negative-text mt-1 text-xs">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Custom industry dropdown */}
                  <div className="space-y-1.5">
                    <label className="text-primary-text text-[13px] font-medium">
                      Industry
                    </label>
                    <div className="relative" ref={dropdownRef}>
                      <Button
                        type="button"
                        onClick={() => setOpen((o) => !o)}
                        className="border-input-b focus:ring-brand flex w-full items-center justify-between rounded-[8px] border bg-white px-4 py-3 text-[13px] transition focus:ring-2 focus:outline-none"
                      >
                        <span
                          className={
                            industry
                              ? "text-primary-text"
                              : "text-disabled-text"
                          }
                        >
                          {industry || "Select..."}
                        </span>
                        <ChevronDown
                          size={16}
                          className={`text-disabled-text transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                        />
                      </Button>

                      <div
                        className={`border-input-b absolute z-10 mt-1 w-full origin-top overflow-hidden rounded-[8px] border bg-white shadow-lg transition-all duration-200 ${
                          open
                            ? "scale-y-100 opacity-100"
                            : "pointer-events-none scale-y-0 opacity-0"
                        }`}
                      >
                        {industries.map((i) => (
                          <Button
                            key={i}
                            variant="dropdownItem"
                            type="button"
                            onClick={() => {
                              setValue("industry", i, { shouldValidate: true });
                              setOpen(false);
                            }}
                            className={`hover:bg-brand-light-subtle-bg w-full px-4 py-2.5 text-left text-[13px] transition-colors ${
                              industry === i
                                ? "text-brand font-medium"
                                : "text-primary-text"
                            }`}
                          >
                            {i}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="message"
                      className="text-primary-text text-[13px] font-medium"
                    >
                      Message <span className="text-negative-text">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      placeholder="Type your messages"
                      {...register("message")}
                      className={`placeholder:text-disabled-text w-full resize-none rounded-[8px] border px-4 py-3 text-[13px] transition focus:ring-2 focus:outline-none ${
                        errors.message || characterCount > 450
                          ? "border-negative-text focus:ring-negative-text"
                          : "border-input-b focus:ring-brand focus:border-transparent"
                      }`}
                    />
                    <div className="mt-1 flex items-center justify-between">
                      <div>
                        {(errors.message?.message || characterCount > 450) && (
                          <p className="text-negative-text text-xs">
                            {errors.message?.message ||
                              "Message cannot exceed 450 characters."}
                          </p>
                        )}
                      </div>
                      <span
                        className={`text-xs ${
                          characterCount > 450
                            ? "text-negative-text font-medium"
                            : "text-disabled-text"
                        }`}
                      >
                        {characterCount} / 450
                      </span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={!isValid || pending}
                    className="bg-brand hover:enabled:bg-brand-hover-bg w-full rounded-[8px] py-3.5 text-[14px] font-medium text-white transition-all disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {pending ? "Sending…" : "Continue"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </main>

        <CTA />
      </div>
    </div>
  );
}
