import { Icon } from "@iconify/react";

const ContactInfo = () => {
  return (
    <div className="col-span-1 bg-bgLight rounded-[30px] border border-gray-100 dark:border-[#27272A] p-8 lg:p-12 flex flex-col gap-8 w-full shadow-sm h-full">
      <h5 className="flex flex-col xl:flex-row gap-4 items-center text-xl font-jost tracking-tight text-dark hover:text-primary transition-colors">
        <Icon icon="mdi:email" className="w-8 h-8 text-primary" /> info@yourdomain.com
      </h5>
      <h5 className="flex flex-col xl:flex-row gap-4 items-center text-xl font-jost tracking-tight text-dark hover:text-primary transition-colors">
        <Icon icon="mdi:phone" className="w-8 h-8 text-primary" /> +1 (805) 225-7663
      </h5>
      <h5 className="flex flex-col xl:flex-row gap-4 items-center text-xl font-jost tracking-tight text-dark hover:text-primary transition-colors">
        <Icon icon="mdi:web" className="w-8 h-8 text-primary" /> www.trackora.tech
      </h5>
    </div>
  );
};

export default ContactInfo;
