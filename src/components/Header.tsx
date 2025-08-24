import { Button } from "@/components/ui/button";
import { ShoppingBag, Menu } from "lucide-react";

interface HeaderProps {
  cartCount?: number;
}

const Header = ({ cartCount = 0 }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold bg-hero-gradient bg-clip-text text-transparent">
              PicksyAI
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Cart {cartCount > 0 && `(${cartCount})`}
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;