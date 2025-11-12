import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";

export default function Home() {
  return (
    <div>
      <div className="text-5xl bg-red-400">Hello</div>
      <Button>Click me</Button>
      <Card title="My Card">This is a card.</Card>

      {/* Test cases */}
      <a className="bg-green-200">Just text - works?</a>
      <br />
      <a className="bg-blue-300">
        <h2>With h2 inside</h2>
      </a>
      <br />
      <a className="bg-purple-300 block">
        <h2>With h2 inside + block</h2>
      </a>
    </div>
  );
}
