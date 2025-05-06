import { useEffect, useState } from 'react';
import { Navigation } from '../components/navigation';
import { Footer } from '../components/footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Upload, DollarSign, Plus, X } from 'lucide-react';
import { Label } from '../components/ui/label';
import { Service_backend } from '@/declarations/Service_backend';
import { useAuth } from '@/utility/use-auth-client';
import { Principal } from '@dfinity/principal';
import { backend } from '@/utility/backend';
import { Service } from '@/declarations/Service_backend/Service_backend.did';
import { UnregisteredService } from '@/declarations/Service_backend/Service_backend.did';
export default function CreateServicePage() {
  const [images, setImages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [freelancerId, setFreelancerId] = useState<Principal | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [category, setCategory] = useState<string>('');
  const [deliveryDays, setDeliveryDays] = useState<string>('');
  const [revisions, setRevisions] = useState<string>('');
  
  const { principal } = useAuth();
  
  useEffect(() => {
    const fetchFreelancerId = async () => {
      try {
        const id = await backend.whoami();
        setFreelancerId(id);
      } catch (err) {
        console.error('Failed to fetch freelancerId:', err);
      }
    };

    fetchFreelancerId();
  }, []);

  const handleAddImage = () => {
    // Simulate adding an image
    const newImage = `/placeholder.svg?height=200&width=300&text=Image${images.length + 1}`;
    setImages([...images, newImage]);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim() !== '') {
      e.preventDefault();
      if (!tags.includes(newTag.trim())) {
        setTags([...tags, newTag.trim()]);
      }
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  function getBigInt(value: string | null): bigint {
    // Handle unlimited special case
    if (!value || value.toLowerCase() === 'unlimited') {
      return BigInt(Number.MAX_SAFE_INTEGER);
    }
    
    // For price values that might be decimal
    if (value.includes('.')) {
      // Convert to integer by removing the decimal point (treat as atomic units)
      // For example: 0.10 ICP → 10 (representing 10 finney or 0.1 ICP)
      const parts = value.split('.');
      // Ensure we have 2 decimal places for consistency
      const decimalPart = (parts[1] || '').padEnd(2, '0').substring(0, 2);
      // Combine and convert to BigInt
      return BigInt(parts[0] + decimalPart);
    }
    
    // For non-decimal values
    return BigInt(value);
  }
  const getNat = (value: string): bigint => {
    const num = BigInt(value);
    if (num < 0n) {
      throw new Error("Value must be a natural number (0 or greater)");
    }
    return num;
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    try {
      // Get form data using the form elements
      const form = e.target as HTMLFormElement;
      const titleInput = form.querySelector('#title') as HTMLInputElement;
      const descriptionTextarea = form.querySelector('#description') as HTMLTextAreaElement;
      const priceInput = form.querySelector('#price') as HTMLInputElement;
      
      // Validation
      if (!titleInput?.value) {
        setFormError("Title is required");
        setIsSubmitting(false);
        return;
      }
      
      if (!descriptionTextarea?.value) {
        setFormError("Description is required");
        setIsSubmitting(false);
        return;
      }
      
      if (!category) {
        setFormError("Category is required");
        setIsSubmitting(false);
        return;
      }
      
      if (!priceInput?.value) {
        setFormError("Price is required");
        setIsSubmitting(false);
        return;
      }
      
      if (!deliveryDays) {
        setFormError("Delivery time is required");
        setIsSubmitting(false);
        return;
      }
      
      if (!revisions) {
        setFormError("Number of revisions is required");
        setIsSubmitting(false);
        return;
      }

      // Collect features from What's Included inputs
      const featureInputs = form.querySelectorAll('.feature-input') as NodeListOf<HTMLInputElement>;
      const features: string[] = [];
      featureInputs.forEach(input => {
        if (input.value) features.push(input.value);
      });
      
      if (features.length === 0) {
        features.push("Basic service package"); // Default feature if none provided
      }

      if (principal != null && freelancerId != null) {
        const serviceData: UnregisteredService = {
          freelancerId,
          title: titleInput.value,
          description: descriptionTextarea.value,
          category: category,
          subcategory: "general", // Default subcategory
          currency: "ICP", // Default currency
          status: "ACTIVE",
          tags: tags.length > 0 ? tags : [], // Use collected tags or empty array
          attachments: images.length > 0 ? [images.map(url => ({ imageUrl: url, imageTag: "service image" }))] : [],
          tiers: [
            {
              id: "basic",
              name: "Basic",
              description: "Basic tier service",
              // Convert price - handle as atomic units (e.g., 0.1 ICP = 100000000000000000 wei)
              price: getNat(priceInput.value),
              deliveryDays: getNat(deliveryDays),
              revisions: getNat(revisions),
              features: features,
            },
          ],
         
        };

        console.log("Submitting service data:", serviceData);
        const response = await Service_backend.createService(serviceData);
        console.log("Service creation response:", response);
        setIsSuccess(true);
      } else {
        setFormError("Authentication error. Please make sure you're logged in.");
      }
    } catch (error) {
      console.error('Error submitting service:', error);
      setFormError(`Error submitting service: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  type Image = {
    imageTag: string;
    imageUrl: string;
  };

  // Interface that defines the data structure for a service tier
  interface ServiceTier {
    id: string;
    name: string; // "Basic", "Standard", "Premium"
    description: string;
    price: bigint;
    deliveryDays: bigint;
    revisions: bigint;
    features: string[];
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Create a New Service</h1>
          <p className="text-muted-foreground mb-8">
            Share your skills and start earning
          </p>
          
          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-6">
              {formError}
            </div>
          )}
          
          {isSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded mb-6">
              Service created successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Basic Information Section */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Service Title</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    placeholder="I will..." 
                    required 
                  />
                  <p className="text-xs text-muted-foreground">
                    Your title should be attention-grabbing and accurately
                    describe your service (max 80 characters)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    required 
                    name="category" 
                    value={category} 
                    onValueChange={setCategory}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="writing">Writing</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="music">Music</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="lifestyle">Lifestyle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Service Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your service in detail..."
                    className="min-h-[200px]"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Be specific about what you offer, your process, and what
                    clients can expect
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <Input
                    id="tags"
                    placeholder="Add tags (press Enter)"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={handleAddTag}
                  />
                  <p className="text-xs text-muted-foreground">
                    Add relevant tags to help clients find your service
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Pricing & Packages Section */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing & Packages</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (ICP)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      placeholder="0.00"
                      className="pl-9"
                      step="0.01"
                      min="0.01"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter price in ICP (e.g., 0.10 for 0.1 ICP). Decimals will be handled correctly.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryDays">Delivery Time (days)</Label>
                  <Select 
                    required 
                    name="deliveryDays"
                    value={deliveryDays}
                    onValueChange={setDeliveryDays}
                  >
                    <SelectTrigger id="deliveryDays">
                      <SelectValue placeholder="Select delivery time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 day</SelectItem>
                      <SelectItem value="2">2 days</SelectItem>
                      <SelectItem value="3">3 days</SelectItem>
                      <SelectItem value="5">5 days</SelectItem>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="14">14 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="revisions">Number of Revisions</Label>
                  <Select 
                    required 
                    name="revisions"
                    value={revisions}
                    onValueChange={setRevisions}
                  >
                    <SelectTrigger id="revisions">
                      <SelectValue placeholder="Select number of revisions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 revision</SelectItem>
                      <SelectItem value="2">2 revisions</SelectItem>
                      <SelectItem value="3">3 revisions</SelectItem>
                      <SelectItem value="5">5 revisions</SelectItem>
                      <SelectItem value="unlimited">Unlimited revisions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>What's Included</Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Input placeholder="e.g., Source files" className="feature-input" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Input placeholder="e.g., Commercial use" className="feature-input" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Input placeholder="e.g., 24/7 support" className="feature-input" />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add More
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gallery & FAQ Section */}
            <Card>
              <CardHeader>
                <CardTitle>Gallery & FAQ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Service Images</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className="relative aspect-video rounded-lg overflow-hidden border"
                      >
                        <img
                          src={image || '/placeholder.svg'}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          className="absolute top-2 right-2 bg-background/80 p-1 rounded-full"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddImage}
                      className="aspect-video flex flex-col items-center justify-center border border-dashed rounded-lg p-4 hover:bg-muted/50 transition-colors"
                    >
                      <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Add Image
                      </span>
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Add up to 5 images showcasing your service. First image
                    will be the cover.
                  </p>
                </div>

                <div className="space-y-4">
                  <Label>Frequently Asked Questions</Label>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Input placeholder="Question" />
                      <Textarea placeholder="Answer" />
                    </div>
                    <div className="space-y-2">
                      <Input placeholder="Question" />
                      <Textarea placeholder="Answer" />
                    </div>
                    <Button type="button" variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-1" /> Add FAQ
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Service"}
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}