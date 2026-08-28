import Image from "next/image";
import Link from "next/link";

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Scrollable form column */}
      <section className="remove-scrollbar flex-1 overflow-y-auto px-[5%] my-5">
        <div className="sub-container max-w-[496px]">
          <Image
            src="/assets/icons/logo-full.svg"
            alt="carepulse"
            width={1000}
            height={1000}
            className="mb-12 h-10 w-fit"
            priority
            draggable="false"
          />

          {children}

          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              © {new Date().getFullYear()} CarePulse. All rights reserved.
            </p>
            <Link href="/?admin=true" className="text-green-500">
              Admin
            </Link>
          </div>
        </div>
      </section>

      {/* Sidebar image — fixed on right, hidden on mobile */}
      <div className="relative hidden h-full w-[390px] xl:w-[700px] md:block">
        <Image
          src="/assets/images/register-img.png"
          alt="register"
          fill
          priority
          sizes="(max-width: 1200px) 390px, 490px"
          className="object-cover object-left"
          draggable="false"
        />
      </div>
    </div>
  );
}
