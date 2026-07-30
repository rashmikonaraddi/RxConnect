import LoginForm from "@/components/LoginForm";

export default function AdminLogin() {
  return (
    <main className="
      min-h-screen
      bg-gradient-to-br
      from-purple-100
      via-white
      to-indigo-100
      flex
      items-center
      justify-center
      px-6
    ">

      <LoginForm role="Admin" />

    </main>
  );
}