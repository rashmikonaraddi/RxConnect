import Link from "next/link";

export default function RoleCard({ role, description, link }) {
  const icons = {
    Customer: "",
    Pharmacist: "",
    "Delivery Partner": "",
    Admin: "🏥",
  };

  const colors = {
    Customer: "from-blue-500 to-cyan-500",
    Pharmacist: "from-green-500 to-emerald-500",
    "Delivery Partner": "from-orange-500 to-amber-500",
    Admin: "from-purple-500 to-indigo-500",
  };

  return (
    <Link href={link}>
      <div
        className="
          group
          relative
          overflow-hidden
          rounded-2xl
          border
          border-gray-200
          bg-white
          p-5
          transition-all
          duration-300
          hover:-translate-y-1
          hover:border-blue-300
          hover:shadow-xl
        "
      >
        <div className="flex items-center gap-4">

          <div
            className={`
              h-16
              w-16
              rounded-2xl
              bg-gradient-to-br
              ${colors[role]}
              flex
              items-center
              justify-center
              text-3xl
              shadow-lg
              transition-transform
              duration-300
              group-hover:scale-110
            `}
          >
            {icons[role]}
          </div>

          <div className="flex-1">

            <h3 className="text-lg font-bold text-gray-800">
              {role}
            </h3>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              {description}
            </p>

          </div>

        </div>

        <div className="mt-5 flex items-center justify-between">

          <span className="text-sm font-medium text-blue-700">
            Continue
          </span>

          <span className="text-xl transition-transform duration-300 group-hover:translate-x-2">
            →
          </span>

        </div>

        <div
          className="
            absolute
            left-0
            top-0
            h-1
            w-0
            bg-blue-600
            transition-all
            duration-300
            group-hover:w-full
          "
        />
      </div>
    </Link>
  );
}