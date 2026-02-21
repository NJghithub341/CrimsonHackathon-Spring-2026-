import React from 'react';

interface PixelAvatarSelectorProps {
  selectedAvatar: string;
  onSelect: (avatar: string) => void;
}

const PIXEL_AVATARS = [
  { id: 'wizard', emoji: '🧙‍♂️', name: 'Code Wizard' },
  { id: 'ninja', emoji: '🥷', name: 'Bug Ninja' },
  { id: 'robot', emoji: '🤖', name: 'Debug Bot' },
  { id: 'hacker', emoji: '👨‍💻', name: 'Elite Hacker' },
  { id: 'pirate', emoji: '🏴‍☠️', name: 'Code Pirate' },
  { id: 'alien', emoji: '👽', name: 'Alien Coder' },
  { id: 'ghost', emoji: '👻', name: 'Ghost Dev' },
  { id: 'dragon', emoji: '🐉', name: 'Data Dragon' },
  { id: 'unicorn', emoji: '🦄', name: 'Unicorn Dev' },
  { id: 'cat', emoji: '🐱', name: 'Cat Programmer' },
];

export const PixelAvatarSelector: React.FC<PixelAvatarSelectorProps> = ({
  selectedAvatar,
  onSelect,
}) => {
  return (
    <div className="pixel-container p-4">
      <h3 className="pixel-font text-white mb-4 text-center">CHOOSE YOUR FIGHTER</h3>
      <div className="grid grid-cols-5 gap-3">
        {PIXEL_AVATARS.map((avatar) => (
          <button
            key={avatar.id}
            onClick={() => onSelect(avatar.emoji)}
            className={`p-3 pixel-border transition-all transform hover:scale-110 ${
              selectedAvatar === avatar.emoji
                ? 'bg-yellow-600 border-yellow-400'
                : 'bg-gray-700 border-gray-500 hover:bg-gray-600'
            }`}
          >
            <div className="text-2xl pixel-avatar mb-1">{avatar.emoji}</div>
            <div className="pixel-font-small text-white text-center">
              {avatar.name}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};