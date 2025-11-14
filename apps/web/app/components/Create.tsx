import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { useMutation } from "@tanstack/react-query";
import { Plus, Sparkles } from "lucide-react";
import { createRoom } from "../query/apis/room";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function Create() {
  return (
    <div className="flex gap-4">
      <CreateSpace />
      <JoinSpace />
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
    <div className="w-42 md:w-56 aspect-video bg-white/3  text-white/50 rounded-lg border border-white/10 flex flex-col  gap-1.5 items-center justify-center cursor-pointer hover:bg-white/5 transition">
      <Icon className="h-6 w-6 md:h-8 md:w-8" />
      <span className="text-sm md:text-base font-medium">{title}</span>
    </div>
  );
}

export default Create;

function CreateSpace() {
  const [name, setName] = useState("");
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationKey: ["create-room"],
    mutationFn: (data: { name: string }) => {
      return createRoom(data);
    },
    onSuccess: (data) => {
      if (!data.success || data.error) {
        toast.error(data.error || "Something went wrong");
        return;
      }
      toast.success("Space created successfully");
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <CreateCard title="Create Space" Icon={Plus} />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border-white/20 py-10">
        <DialogHeader>
          <DialogTitle>Create a Space</DialogTitle>
          <DialogDescription>
            Enter a name for your new space.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-3">
          <div className="grid gap-3">
            <Label htmlFor="space-name">Space Name</Label>
            <Input
              id="space-name"
              name="spaceName"
              placeholder="Enter space name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            type="submit"
            onClick={() => mutate({ name: "New Space" })}
            disabled={isPending}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function JoinSpace() {
  return <CreateCard title="Join Space" Icon={Sparkles} />;
}
