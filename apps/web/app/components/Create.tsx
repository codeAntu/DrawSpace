
import { Plus, Sparkles } from "lucide-react";

function Create() {
  return (
    <div className="flex gap-4">
      <CreateCard title="Create a new Space" Icon={Plus} />
      <CreateCard title="Join Space" Icon={Sparkles} />
    </div>
  );
}

function CreateCard({
  title,
  Icon,
}: {
  title: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) {
  return (
    <div className="w-42 md:w-56 aspect-video bg-white/5  text-white/50 rounded-lg border border-white/10 flex flex-col  gap-1.5 items-center justify-center cursor-pointer hover:bg-white/10 transition">
      <Icon className="h-6 w-6 md:h-8 md:w-8" />
      <span className="text-sm md:text-base font-medium">{title}</span>
    </div>
  );
}


export default Create;