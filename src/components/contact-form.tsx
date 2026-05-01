import React, { useState } from "react";

const ContactForm = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    const accessKey = import.meta.env.PUBLIC_WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      setStatus('error');
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.append("access_key", accessKey);

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();

      if (result.success) {
        setStatus('success');
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="col-span-1 lg:col-span-2">
      <form onSubmit={handleSubmit} className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
        <label htmlFor="name" className="flex flex-col gap-2">
          <input
            required
            type="text"
            name="name"
            className="w-full bg-bgLight border border-gray-300 rounded-[10px] px-6 py-4 outline-none text-body font-jost text-dark focus:border-primary transition-colors"
            placeholder="Name"
          />
        </label>
        <label htmlFor="email" className="flex flex-col gap-2">
          <input
            required
            type="email"
            name="email"
            className="w-full bg-bgLight border border-gray-300 rounded-[10px] px-6 py-4 outline-none text-body font-jost text-dark focus:border-primary transition-colors"
            placeholder="Email"
          />
        </label>
        <label htmlFor="subject" className="flex flex-col gap-2">
          <input
            required
            type="text"
            name="subject"
            className="w-full bg-bgLight border border-gray-300 rounded-[10px] px-6 py-4 outline-none text-body font-jost text-dark focus:border-primary transition-colors"
            placeholder="Subject"
          />
        </label>
        <label htmlFor="phone" className="flex flex-col gap-2">
          <input
            required
            type="number"
            name="phone"
            className="w-full bg-bgLight border border-gray-300 rounded-[10px] px-6 py-4 outline-none text-body font-jost text-dark focus:border-primary transition-colors"
            placeholder="Phone"
          />
        </label>
        <label htmlFor="message" className="col-span-1 md:col-span-2 flex flex-col gap-2">
          <textarea
            required
            name="message"
            className="w-full bg-bgLight border border-gray-300 rounded-[10px] px-6 py-4 outline-none text-body font-jost text-dark focus:border-primary transition-colors min-h-[150px]"
            placeholder="Hello, I am interested in..."
          ></textarea>
        </label>

        <div className="w-full flex flex-col gap-4 md:flex-row md:justify-end col-span-1 md:col-span-2 items-center">
          {status === 'success' && <p className="text-blue-600 font-bold">Message sent successfully!</p>}
          {status === 'error' && <p className="text-red-600 font-bold">Failed to send. Try again.</p>}
          <button type="submit" disabled={status === 'loading'} className="bg-dark text-white dark:text-[#09090B] rounded-[18px] px-10 py-5 font-bold tracking-widest text-[13px] uppercase hover:bg-primary transition-all shadow-lg hover:shadow-xl disabled:opacity-50">
            {status === 'loading' ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
