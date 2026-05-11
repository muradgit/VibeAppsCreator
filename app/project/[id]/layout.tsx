import { Sidebar } from "@/components/layout/Sidebar";

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-slate-950">
            {children}
        </main>
    </>
  );
}
