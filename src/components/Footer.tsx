const Footer = () => {
  return (
    <footer className="w-full bg-background-inverse py-10 px-4">
      <div className="mx-auto max-w-container text-center text-foreground-alt">
        <p className="text-[18px] font-bold">Bath Area Growers</p>
        <p className="mt-2 text-[14px]">
          Email:{" "}
          <a href="mailto:info@bathareagrowers.org" className="text-foreground-alt underline hover:text-foreground-alt">
            info@bathareagrowers.org
          </a>
        </p>
        <p className="mt-1 text-[14px]">Tel 07913617822</p>
      </div>
    </footer>
  );
};

export default Footer;
