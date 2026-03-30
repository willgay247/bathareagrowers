import { Link } from "react-router-dom";

const CtaBanner = () => {
  return (
    <section className="w-full bg-accent py-[60px] px-4">
      <div className="flex flex-col items-center justify-center text-center">
        <h2 className="text-foreground-alt font-bold text-[32px]">
          Talk to us about local growing, get in touch!
        </h2>
        <Link
          to="/contact/"
          className="mt-6 inline-block rounded-[6px] border-2 border-foreground-alt bg-transparent px-9 py-3 text-[15px] font-semibold text-foreground-alt no-underline transition-colors hover:bg-foreground-alt hover:text-accent"
        >
          Contact us
        </Link>
      </div>
    </section>
  );
};

export default CtaBanner;
