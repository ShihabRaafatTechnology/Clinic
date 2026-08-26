import { RegisterForm } from "@/components/forms/RegisterForm";
import Image from "next/image";
import Link from "next/link";
import { users } from "@/lib/appwrite.config";

export default async function Register({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  // Fetch user data from Appwrite
  const user = await users.get(userId);

  const userData: User = {
    $id: user.$id,
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
  };

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          <Image
            src="/assets/icons/logo-full.svg"
            alt="patient"
            width={1000}
            height={1000}
            className="mb-12 h-10 w-fit"
          />

          <RegisterForm user={userData} />

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

      <Image
        src="/assets/images/register-img.png"
        alt="register"
        width={1000}
        height={1000}
        className="side-img max-w-[35%]"
      />
    </div>
  );
}
