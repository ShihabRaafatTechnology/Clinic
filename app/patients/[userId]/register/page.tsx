import { RegisterForm } from "@/components/forms/RegisterForm";
import { users } from "@/lib/appwrite.config";

interface RegisterProps {
  params: Promise<{ userId: string }>;
}

export default async function Register({ params }: RegisterProps) {
  const { userId } = await params;

  // Fetch the Appwrite user
  const user = await users.get(userId);

  const userData: User = {
    $id: user.$id,
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
  };

  return <RegisterForm user={userData} />;
}