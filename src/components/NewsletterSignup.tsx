const NewsletterSignup = () => {
  return (
    <section className="w-full bg-background py-[60px] px-4">
      <div className="mx-auto max-w-[480px] text-center">
        <h3 className="text-foreground font-bold text-[24px] mb-6">
          Sign up to the Bath Area Growers newsletter
        </h3>
        <form
          action="http://eepurl.com/iSlf1U"
          method="POST"
          target="_blank"
          className="flex"
        >
          <input
            type="email"
            name="EMAIL"
            required
            placeholder="Your email address *"
            className="flex-1 min-w-0 rounded-l-[4px] rounded-r-none border border-foreground/30 bg-background px-3 py-3 text-[15px] text-foreground outline-none focus:border-accent"
          />
          <button
            type="submit"
            className="rounded-l-none rounded-r-[4px] bg-accent px-6 py-3 text-[15px] font-semibold text-foreground-alt transition-colors hover:bg-accent-secondary"
          >
            Subscribe
          </button>
          {/* Mailchimp anti-bot */}
          <input type="text" name="b_" tabIndex={-1} value="" readOnly className="absolute left-[-5000px]" aria-hidden="true" />
        </form>
        <p className="mt-3 text-[12px] text-foreground/60">* indicates required</p>
      </div>
    </section>
  );
};

export default NewsletterSignup;
