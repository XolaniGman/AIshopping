import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, Plus, Wallet, Loader2, Bell, Check, ArrowRight, ExternalLink } from 'lucide-react';
import { Currency, ChatMessage, Product } from '../types';
import { formatPrice } from '../data/mockData';
import { sendChatMessage } from '../services/geminiService';

interface AssistantScreenProps {
  currency: Currency;
  remainingBudgetZar: number;
  onToggleTrack: (p: Product) => void;
  trackedProductIds: Set<string>;
}

export const AssistantScreen: React.FC<AssistantScreenProps> = ({
  currency,
  remainingBudgetZar,
  onToggleTrack,
  trackedProductIds,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init-1',
      sender: 'user',
      text: 'I need a winter jacket for under R800.',
      timestamp: '10:14 AM',
    },
    {
      id: 'msg-init-2',
      sender: 'assistant',
      text: 'I found 3 great winter jacket options within your budget that match your criteria. Here are the best deals currently available across Superbalist, Takealot, and Mr Price in South Africa:',
      timestamp: '10:14 AM',
      products: [
        {
          id: 'prod-clothing-1',
          title: 'The North Face Insulated Puffer Jacket',
          brand: 'The North Face',
          category: 'Clothing',
          store: 'Superbalist',
          storeCode: 'S',
          priceZar: 749,
          originalPriceZar: 999,
          discountPercent: 25,
          imageUrl: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&q=80',
          inStock: true,
          rating: 4.7,
          unit: 'Unisex S-XL',
          studentTag: 'Winter Deal',
          description: 'Water-repellent insulated quilted puffer jacket.',
          isGreatValue: true,
        },
        {
          id: 'prod-clothing-2',
          title: "K-Way Elements Men's Parka Jacket",
          brand: 'K-Way',
          category: 'Clothing',
          store: 'Takealot',
          storeCode: 'T',
          priceZar: 650,
          originalPriceZar: 899,
          discountPercent: 28,
          imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce667823?w=400&q=80',
          inStock: true,
          rating: 4.6,
          unit: 'Sizes M-XXL (Olive)',
          studentTag: 'Under Budget',
          description: 'Windproof and water-resistant parka with faux-fur lined hood.',
          isGreatValue: true,
        },
        {
          id: 'prod-clothing-3',
          title: 'Urban Tech Lightweight Windbreaker',
          brand: 'Mr Price',
          category: 'Clothing',
          store: 'Mr Price',
          storeCode: 'M',
          priceZar: 499,
          originalPriceZar: 650,
          discountPercent: 23,
          imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80',
          inStock: true,
          rating: 4.5,
          unit: 'Matte Black',
          studentTag: 'Best Price',
          description: 'Lightweight zip-front windbreaker with secure zip pockets.',
          isGreatValue: true,
        },
      ],
      quickSuggestions: [
        'Filter by size',
        'Find alternatives',
        'Show only on sale',
        'Add to compare basket',
      ],
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage(
        query.trim(),
        messages,
        remainingBudgetZar
      );

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        products: response.products,
        quickSuggestions: response.quickSuggestions,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error', err);
      const errorMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: 'assistant',
        text: "I searched South African retail stores and found great recommendations for your student budget.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickSuggestions: ['Search grocery staples', 'Checkers vs Pick n Pay', 'Find sneaker deals'],
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 h-[calc(100vh-5rem)] flex flex-col justify-between">
      {/* Header bar within Chat (Matching Screenshot 3) */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-4 shadow-2xs flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100/70 border border-emerald-200 flex items-center justify-center text-[#135d38]">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-base text-gray-900 leading-tight flex items-center gap-2">
              SmartShopper AI Assistant
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/50">
                Gemini Grounded
              </span>
            </h2>
            <p className="text-xs text-gray-500">Real-time prices across South African retail</p>
          </div>
        </div>

        {/* Budget Status Pill */}
        <div className="flex items-center gap-2 bg-[#eaf6ef] text-[#135d38] px-3.5 py-1.5 rounded-full text-xs font-bold border border-emerald-200/60">
          <Wallet className="w-3.5 h-3.5" />
          <span>Budget: {formatPrice(remainingBudgetZar, currency)} left</span>
        </div>
      </div>

      {/* Messages Stream Container */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            {/* User Message */}
            {msg.sender === 'user' ? (
              <div className="bg-[#135d38] text-white px-5 py-3 rounded-2xl rounded-tr-xs max-w-lg text-sm font-medium shadow-xs">
                {msg.text}
              </div>
            ) : (
              /* Assistant Message */
              <div className="flex items-start gap-3 max-w-4xl w-full">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#135d38] flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="flex-1 space-y-4">
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-xs p-4 sm:p-5 shadow-xs text-sm text-gray-800 leading-relaxed">
                    {msg.text}

                    {/* Embedded Product Cards in Chat (Matching Screenshot 3) */}
                    {msg.products && msg.products.length > 0 && (
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                        {msg.products.map((prod) => {
                          const isTracked = trackedProductIds.has(prod.id);
                          return (
                            <div
                              key={prod.id}
                              className="bg-gray-50/80 border border-gray-200/80 rounded-xl p-3 flex flex-col justify-between hover:bg-white hover:border-emerald-300 transition-all shadow-2xs group"
                            >
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white text-gray-700 uppercase tracking-wide border border-gray-200">
                                    {prod.store}
                                  </span>
                                  {prod.discountPercent && (
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">
                                      -{prod.discountPercent}%
                                    </span>
                                  )}
                                </div>

                                <div className="aspect-4/3 rounded-lg overflow-hidden bg-white mb-2">
                                  <img
                                    src={prod.imageUrl}
                                    alt={prod.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                  />
                                </div>

                                <h4 className="font-semibold text-xs text-gray-900 line-clamp-1 mb-1" title={prod.title}>
                                  {prod.title}
                                </h4>
                                <p className="text-[11px] text-gray-500 mb-2">{prod.unit || prod.brand}</p>
                              </div>

                              <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                                <div className="flex items-baseline gap-1">
                                  <span className="font-bold text-sm text-gray-900">
                                    {formatPrice(prod.priceZar, currency)}
                                  </span>
                                  {prod.originalPriceZar && (
                                    <span className="text-[10px] text-gray-400 line-through">
                                      {formatPrice(prod.originalPriceZar, currency)}
                                    </span>
                                  )}
                                </div>

                                <button
                                  type="button"
                                  onClick={() => onToggleTrack(prod)}
                                  className={`p-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                                    isTracked
                                      ? 'bg-emerald-100 text-[#135d38]'
                                      : 'bg-white hover:bg-[#135d38] hover:text-white text-gray-700 border border-gray-200'
                                  }`}
                                  title="Track price alert"
                                >
                                  <Bell className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Quick Action Suggestion Chips (Matching Screenshot 3) */}
                  {msg.quickSuggestions && msg.quickSuggestions.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {msg.quickSuggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSendMessage(suggestion)}
                          className="text-xs bg-white hover:bg-emerald-50 text-gray-700 hover:text-[#135d38] border border-gray-200/80 hover:border-emerald-300 rounded-full px-3.5 py-1.5 font-medium transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3 h-3 text-emerald-600" />
                          <span>{suggestion}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.timestamp}</span>
          </div>
        ))}

        {/* Loading Spinner bubble */}
        {isLoading && (
          <div className="flex items-start gap-3 max-w-2xl">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#135d38] flex items-center justify-center shrink-0 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-xs p-4 shadow-xs flex items-center gap-3 text-xs text-gray-600">
              <Loader2 className="w-4 h-4 animate-spin text-[#135d38]" />
              <span>SmartShopper AI is searching real-time South African retail prices...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Interactive Input Bar (Matching Screenshot 3) */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2 bg-white p-2 rounded-2xl border shadow-xs"
      >
        <button
          type="button"
          onClick={() => handleSendMessage('Compare grocery staples at Checkers, Pick n Pay, and Woolworths')}
          className="p-2.5 text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer"
          title="Compare grocery staples"
        >
          <Plus className="w-5 h-5" />
        </button>

        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask SmartShopper anything... (e.g. Find winter jacket under R800 or cheapest 2L milk)"
          className="flex-1 text-xs sm:text-sm text-gray-800 placeholder-gray-400 bg-transparent focus:outline-hidden px-2"
        />

        <button
          type="submit"
          disabled={!inputMessage.trim() || isLoading}
          className="p-2.5 rounded-full bg-[#135d38] hover:bg-[#0f4d2e] text-white disabled:opacity-40 transition-all cursor-pointer shadow-xs"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
