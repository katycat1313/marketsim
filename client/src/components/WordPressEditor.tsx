import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Edit, Save, Plus, Trash2, Image, Link, Code, Settings, Type, FileText, List, Check } from 'lucide-react';
import ImageGallery from './ImageGallery';

interface WordPressEditorProps {
  content: SeoPageContent;
  onContentChange: (content: SeoPageContent) => void;
  readOnly?: boolean;
}

interface SeoPageContent {
  title: string;
  metaDescription: string;
  headings: {
    tag: string;
    content: string;
  }[];
  body: string;
  images: {
    src: string;
    alt: string;
  }[];
  links: {
    href: string;
    text: string;
    isInternal: boolean;
  }[];
  schemaMarkup?: string;
}

interface BlockData {
  id: string;
  type: 'heading' | 'paragraph' | 'image' | 'list' | 'quote' | 'html';
  content: string;
  properties?: Record<string, any>;
}

const WordPressEditor: React.FC<WordPressEditorProps> = ({ content, onContentChange, readOnly = false }) => {
  const [activeTab, setActiveTab] = useState('editor');
  const [blocks, setBlocks] = useState<BlockData[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null);
  const [seoSettings, setSeoSettings] = useState({
    title: content.title,
    metaDescription: content.metaDescription,
    schemaMarkup: content.schemaMarkup || ''
  });
  
  // Initialize blocks from content
  useEffect(() => {
    const initialBlocks: BlockData[] = [];
    
    // Add headings as blocks
    content.headings.forEach((heading, index) => {
      initialBlocks.push({
        id: `heading-${index}`,
        type: 'heading',
        content: heading.content,
        properties: { tag: heading.tag }
      });
    });
    
    // Add body paragraphs as blocks
    const paragraphs = content.body.split('\n\n');
    paragraphs.forEach((paragraph, index) => {
      if (paragraph.trim()) {
        initialBlocks.push({
          id: `paragraph-${index}`,
          type: 'paragraph',
          content: paragraph
        });
      }
    });
    
    // Add images as blocks
    content.images.forEach((image, index) => {
      initialBlocks.push({
        id: `image-${index}`,
        type: 'image',
        content: '',
        properties: { src: image.src, alt: image.alt }
      });
    });
    
    setBlocks(initialBlocks);
  }, []);
  
  // Update parent component when blocks or SEO settings change
  useEffect(() => {
    if (blocks.length === 0) return;
    
    const headings = blocks
      .filter(block => block.type === 'heading')
      .map(block => ({
        tag: block.properties?.tag || 'h2',
        content: block.content
      }));
    
    const body = blocks
      .filter(block => block.type === 'paragraph')
      .map(block => block.content)
      .join('\n\n');
      
    const images = blocks
      .filter(block => block.type === 'image')
      .map(block => ({
        src: block.properties?.src || '',
        alt: block.properties?.alt || ''
      }));
    
    const updatedContent: SeoPageContent = {
      ...content,
      title: seoSettings.title,
      metaDescription: seoSettings.metaDescription,
      schemaMarkup: seoSettings.schemaMarkup,
      headings,
      body,
      images
    };
    
    onContentChange(updatedContent);
  }, [blocks, seoSettings]);
  
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedBlock(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  
  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    
    if (!draggedBlock || draggedBlock === targetId) return;
    
    const updatedBlocks = [...blocks];
    const draggedIndex = updatedBlocks.findIndex(block => block.id === draggedBlock);
    const targetIndex = updatedBlocks.findIndex(block => block.id === targetId);
    
    if (draggedIndex !== -1 && targetIndex !== -1) {
      const [movedBlock] = updatedBlocks.splice(draggedIndex, 1);
      updatedBlocks.splice(targetIndex, 0, movedBlock);
      setBlocks(updatedBlocks);
    }
    
    setDraggedBlock(null);
  };
  
  const handleContentChange = (id: string, newContent: string) => {
    const updatedBlocks = blocks.map(block => 
      block.id === id ? { ...block, content: newContent } : block
    );
    setBlocks(updatedBlocks);
  };
  
  const handlePropertyChange = (id: string, property: string, value: any) => {
    const updatedBlocks = blocks.map(block => 
      block.id === id 
        ? { ...block, properties: { ...block.properties, [property]: value } } 
        : block
    );
    setBlocks(updatedBlocks);
  };
  
  const addBlock = (type: BlockData['type']) => {
    const newBlock: BlockData = {
      id: `${type}-${Date.now()}`,
      type,
      content: type === 'heading' ? 'New Heading' : 
               type === 'paragraph' ? 'New paragraph text...' : 
               type === 'image' ? '' : 'New content',
      properties: type === 'heading' ? { tag: 'h2' } : 
                 type === 'image' ? { src: 'https://via.placeholder.com/300x200', alt: 'Placeholder image' } : 
                 {}
    };
    
    setBlocks([...blocks, newBlock]);
    setSelectedBlock(newBlock.id);
  };
  
  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id));
    if (selectedBlock === id) {
      setSelectedBlock(null);
    }
  };
  
  const renderBlock = (block: BlockData) => {
    const isSelected = selectedBlock === block.id;
    
    switch (block.type) {
      case 'heading':
        const HeadingTag = (block.properties?.tag || 'h2') as keyof JSX.IntrinsicElements;
        return (
          <div
            className={`p-2 mb-2 rounded-md ${isSelected ? 'bg-blue-50 ring-2 ring-blue-300' : 'hover:bg-gray-50'}`}
            onClick={() => setSelectedBlock(block.id)}
            draggable={!readOnly}
            onDragStart={(e) => handleDragStart(e, block.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, block.id)}
          >
            {isSelected && !readOnly ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline">{block.properties?.tag || 'h2'}</Badge>
                  <div className="text-xs text-gray-500">Heading</div>
                  
                  <div className="ml-auto flex gap-1">
                    <select 
                      className="text-xs border rounded p-1"
                      value={block.properties?.tag || 'h2'}
                      onChange={(e) => handlePropertyChange(block.id, 'tag', e.target.value)}
                    >
                      <option value="h1">H1</option>
                      <option value="h2">H2</option>
                      <option value="h3">H3</option>
                      <option value="h4">H4</option>
                    </select>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => removeBlock(block.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <Input
                  value={block.content}
                  onChange={(e) => handleContentChange(block.id, e.target.value)}
                  className="border-blue-300"
                />
              </div>
            ) : (
              <HeadingTag className={
                block.properties?.tag === 'h1' ? 'text-2xl font-bold' :
                block.properties?.tag === 'h2' ? 'text-xl font-bold' :
                block.properties?.tag === 'h3' ? 'text-lg font-bold' :
                'text-base font-bold'
              }>
                {block.content}
              </HeadingTag>
            )}
          </div>
        );
        
      case 'paragraph':
        return (
          <div
            className={`p-2 mb-2 rounded-md ${isSelected ? 'bg-blue-50 ring-2 ring-blue-300' : 'hover:bg-gray-50'}`}
            onClick={() => setSelectedBlock(block.id)}
            draggable={!readOnly}
            onDragStart={(e) => handleDragStart(e, block.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, block.id)}
          >
            {isSelected && !readOnly ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline">Paragraph</Badge>
                  <div className="ml-auto">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => removeBlock(block.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <Textarea
                  value={block.content}
                  onChange={(e) => handleContentChange(block.id, e.target.value)}
                  className="border-blue-300"
                  rows={3}
                />
              </div>
            ) : (
              <p className="text-gray-700">{block.content}</p>
            )}
          </div>
        );
        
      case 'image':
        return (
          <div
            className={`p-2 mb-2 rounded-md ${isSelected ? 'bg-blue-50 ring-2 ring-blue-300' : 'hover:bg-gray-50'}`}
            onClick={() => setSelectedBlock(block.id)}
            draggable={!readOnly}
            onDragStart={(e) => handleDragStart(e, block.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, block.id)}
          >
            {isSelected && !readOnly ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline">Image</Badge>
                  <div className="ml-auto">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => removeBlock(block.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Image URL</label>
                    <Input
                      value={block.properties?.src || ''}
                      onChange={(e) => handlePropertyChange(block.id, 'src', e.target.value)}
                      className="border-blue-300"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Alt Text</label>
                    <Input
                      value={block.properties?.alt || ''}
                      onChange={(e) => handlePropertyChange(block.id, 'alt', e.target.value)}
                      className="border-blue-300"
                      placeholder="Descriptive alt text for SEO"
                    />
                  </div>
                </div>
                
                <div className="bg-gray-100 rounded p-4 text-center">
                  <div className="text-gray-400 text-sm">Image Preview</div>
                  <div className="my-2 h-40 flex items-center justify-center overflow-hidden">
                    {block.properties?.src ? (
                      <img 
                        src={block.properties.src} 
                        alt={block.properties?.alt || ''} 
                        className="max-h-full" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                        }}
                      />
                    ) : (
                      <div className="text-gray-400">No image URL provided</div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="bg-gray-100 p-2 rounded inline-block">
                  {block.properties?.src ? (
                    <img 
                      src={block.properties.src} 
                      alt={block.properties?.alt || ''} 
                      className="max-h-40" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                      }}
                    />
                  ) : (
                    <div className="h-20 w-32 flex items-center justify-center text-gray-400">
                      [Image]
                    </div>
                  )}
                </div>
                {block.properties?.alt && (
                  <div className="text-xs text-gray-500 mt-1">Alt: {block.properties.alt}</div>
                )}
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="border rounded-md">
      <div className="bg-gray-100 p-2 border-b flex items-center">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={activeTab === 'editor' ? 'bg-white' : ''}
            onClick={() => setActiveTab('editor')}
          >
            <FileText className="h-4 w-4 mr-1" />
            Editor
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={activeTab === 'settings' ? 'bg-white' : ''}
            onClick={() => setActiveTab('settings')}
          >
            <Settings className="h-4 w-4 mr-1" />
            SEO Settings
          </Button>
        </div>
      </div>
      
      <div className="p-4">
        {activeTab === 'editor' && (
          <div>
            {!readOnly && (
              <div className="mb-4 flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => addBlock('heading')}
                >
                  <Type className="h-4 w-4 mr-1" />
                  Add Heading
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => addBlock('paragraph')}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Add Paragraph
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => addBlock('image')}
                >
                  <Image className="h-4 w-4 mr-1" />
                  Add Image
                </Button>
              </div>
            )}
            
            <div className="min-h-[400px] border rounded-md p-4 bg-white">
              {blocks.map(block => (
                <div key={block.id}>{renderBlock(block)}</div>
              ))}
              
              {blocks.length === 0 && (
                <div className="h-full flex items-center justify-center text-gray-400">
                  {readOnly ? 'No content available' : 'Add blocks to create content'}
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Page Title</CardTitle>
                <CardDescription>The title tag is a critical SEO element (50-60 characters ideal)</CardDescription>
              </CardHeader>
              <CardContent>
                <Input 
                  value={seoSettings.title} 
                  onChange={(e) => setSeoSettings({...seoSettings, title: e.target.value})}
                  disabled={readOnly}
                  className={!readOnly ? "border-blue-300" : ""}
                />
                <div className="mt-2 text-xs text-gray-500">
                  {seoSettings.title.length} characters
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Meta Description</CardTitle>
                <CardDescription>Appears in search results (150-160 characters ideal)</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea 
                  value={seoSettings.metaDescription} 
                  onChange={(e) => setSeoSettings({...seoSettings, metaDescription: e.target.value})}
                  disabled={readOnly}
                  className={!readOnly ? "border-blue-300" : ""}
                  rows={3}
                />
                <div className="mt-2 text-xs text-gray-500">
                  {seoSettings.metaDescription.length} characters
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Schema Markup</CardTitle>
                <CardDescription>Structured data helps search engines understand your content (JSON-LD format)</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea 
                  value={seoSettings.schemaMarkup} 
                  onChange={(e) => setSeoSettings({...seoSettings, schemaMarkup: e.target.value})}
                  disabled={readOnly}
                  className={!readOnly ? "border-blue-300 font-mono text-sm" : "font-mono text-sm"}
                  rows={8}
                  placeholder={`{\n  "@context": "https://schema.org",\n  "@type": "Article",\n  "headline": "Your headline here",\n  "author": {\n    "@type": "Person",\n    "name": "Author Name"\n  }\n}`}
                />
                <div className="mt-2 text-xs text-gray-500 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  <span>Valid JSON-LD required for structured data</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default WordPressEditor;