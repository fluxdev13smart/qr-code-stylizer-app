
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EmojiPickerProps {
  selectedEmoji: string;
  onEmojiSelect: (emoji: string) => void;
}

const EMOJI_CATEGORIES = {
  "smileys": ["😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", "😋", "😎", "😍", "🥰", "😘"],
  "animals": ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵"],
  "food": ["🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝"],
  "travel": ["🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "🚐", "🚚", "🚛", "🚜", "🛴", "🚲"],
  "objects": ["⌚", "📱", "💻", "🖥️", "🖨️", "🖱️", "🖲️", "📷", "📸", "📹", "📽️", "🎞️", "📞", "☎️", "📟"]
};

const POPULAR_EMOJIS = ["❤️", "👍", "🔥", "✨", "😊", "🎉", "👏", "🙏", "💯", "🌟"];

const EmojiPicker = ({ selectedEmoji, onEmojiSelect }: EmojiPickerProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEmojis, setFilteredEmojis] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("popular");

  useEffect(() => {
    if (searchTerm) {
      // Simple search - in a real app, you'd use emoji metadata for better searching
      const allEmojis = Object.values(EMOJI_CATEGORIES).flat();
      setFilteredEmojis(allEmojis.filter(emoji => emoji.includes(searchTerm)));
    } else {
      setFilteredEmojis([]);
    }
  }, [searchTerm]);

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    setOpen(false);
  };

  const renderEmojiGrid = (emojis: string[]) => (
    <div className="grid grid-cols-6 gap-2">
      {emojis.map((emoji, index) => (
        <Button
          key={index}
          variant="ghost"
          className={`text-2xl h-10 w-10 p-0 hover:bg-gray-100 ${selectedEmoji === emoji ? 'bg-gray-200' : ''}`}
          onClick={() => handleEmojiClick(emoji)}
        >
          {emoji}
        </Button>
      ))}
    </div>
  );

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span className="text-2xl">{selectedEmoji}</span>
            <span className="text-sm text-muted-foreground ml-2">Select Emoji</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <div className="p-3 border-b">
            <Input
              placeholder="Search emojis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          {searchTerm ? (
            <ScrollArea className="h-[300px] p-3">
              {filteredEmojis.length > 0 ? (
                renderEmojiGrid(filteredEmojis)
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  No emojis found
                </div>
              )}
            </ScrollArea>
          ) : (
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="border-b">
                <TabsList className="w-full justify-start rounded-none border-b-0 p-0">
                  <TabsTrigger 
                    value="popular" 
                    className="rounded-none border-b-2 border-transparent py-2 px-3 data-[state=active]:border-qr-purple"
                  >
                    Popular
                  </TabsTrigger>
                  {Object.keys(EMOJI_CATEGORIES).map(category => (
                    <TabsTrigger
                      key={category}
                      value={category}
                      className="rounded-none border-b-2 border-transparent py-2 px-3 data-[state=active]:border-qr-purple"
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              
              <ScrollArea className="h-[300px]">
                <TabsContent value="popular" className="p-3">
                  {renderEmojiGrid(POPULAR_EMOJIS)}
                </TabsContent>
                
                {Object.entries(EMOJI_CATEGORIES).map(([category, emojis]) => (
                  <TabsContent key={category} value={category} className="p-3">
                    {renderEmojiGrid(emojis)}
                  </TabsContent>
                ))}
              </ScrollArea>
            </Tabs>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default EmojiPicker;
