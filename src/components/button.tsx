import { Icon } from "@iconify/react";

export interface ButtonProps {
  variant?: "primary" | "secondary";
  text: string;
  type?: "submit" | "button";
}

const Button = (props: ButtonProps) => {
  const { variant = "primary", text = "Default Text", type = "button" } = props;

  const defaultStyles =
    "rounded-[18px] flex capitalize items-center justify-center gap-[9px] w-fit text-white dark:text-[#09090B] text-base lg:text-lg font-semibold font-['Jost'] leading-snug tracking-tight px-10 py-5 md:px-[54px] md:py-[26px]";
  const bgClass = variant === "primary" ? "bg-primary-200" : "bg-primary-100";
  const className = `${defaultStyles} ${bgClass}`;

  return (
    <button className={className} type={type}>
      {text}
      <Icon icon="mdi:arrow-right" className={`w-6 h-6 ${variant === 'primary' ? 'text-white dark:text-[#09090B]' : 'text-primary-200'}`} />
    </button>
  );
};

export default Button;
