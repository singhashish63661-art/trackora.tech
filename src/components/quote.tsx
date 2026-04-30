import { Icon } from "@iconify/react";

export interface QuoteProps {
  text: string;
  name: string;
}

const QuoteText = ({ text, name }: QuoteProps) => {
  return (
    <div className="flex w-full max-w-full lg:max-w-[80%] flex-col items-center justify-center">
      <div className="flex flex-col w-full items-center justify-center gap-4 lg:gap-8 lg:mx-[-30px]">
        <Icon icon="mdi:format-quote-open" className="w-12 h-12 text-primary-200" />
        <h4 className="text-[20px] leading-[33px] lg:text-[35px] lg:leading-[43.75px] italic tracking-wide font-dm text-primary-200 text-center">
          {text}
        </h4>
        <p className="text-text-gray text-base tracking-tight lg:text-[25px] font-jost lg:leading-[37px] text-center ">
          {" "}
          {`-${name}`}{" "}
        </p>
      </div>
    </div>
  );
};

export default QuoteText;
