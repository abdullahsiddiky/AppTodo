import { z } from "zod";
import axios from "./services/instance";
import { redirect } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
export default function Login() {
  const id = cookies().get("token")?.value;
  if (id) {
    redirect("profile");
  }
  async function axiosRequests(url: string, email: string, password: string) {
    "use server";
    try {
      const result = await axios.post(
        url,
        {
          email: email,
          password: password,
        },
        {
          withCredentials: true,
        }
      );
      return result;
    } catch (error) {
      return error;
    }
  }
  async function login(formData: FormData) {
    "use server";
    const validationSchema = z.object({
      email: z.string().email(),
      password: z.string(),
    });
    const res = validationSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    if (res.success) {
      const data: any = await axiosRequests(
        "users/login",
        res.data.email,
        res.data.password
      );
      if (data.data.status == 200) {
        cookies().set("token", data.data.data.token);
        redirect("profile");
      } else {
        console.log(data);
        redirect("/");
      }
    }
  }
  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" action={login}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <span>
              <Link href="/register">SignUp</Link>
            </span>
          </div>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
