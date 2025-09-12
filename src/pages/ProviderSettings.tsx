import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Copy, Plus, Key, Trash2, Upload, DollarSign, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface Provider {
  id: string;
  provider_name: string;
  website_url: string;
  contact_email: string;
  description: string;
  logo_url?: string;
  created_at: string;
}

interface ApiKey {
  id: string;
  key_name: string;
  key_prefix: string;
  is_active: boolean;
  created_at: string;
}

interface Transaction {
  id: string;
  transaction_type: string;
  amount: number;
  description?: string;
  created_at: string;
}

const ProviderSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    provider_name: '',
    website_url: '',
    contact_email: '',
    description: '',
  });
  const [newKeyName, setNewKeyName] = useState('');
  const [showNewKeyForm, setShowNewKeyForm] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProviderData();
    }
  }, [user]);

  const fetchProviderData = async () => {
    try {
      // Fetch provider info
      const { data: providerData } = await supabase
        .from('providers')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (providerData) {
        setProvider(providerData);
        setFormData({
          provider_name: providerData.provider_name,
          website_url: providerData.website_url,
          contact_email: providerData.contact_email,
          description: providerData.description,
        });

        // Fetch API keys
        const { data: keysData } = await supabase
          .from('api_keys')
          .select('*')
          .eq('provider_id', providerData.id)
          .order('created_at', { ascending: false });

        setApiKeys(keysData || []);

        // Fetch transactions
        const { data: transactionsData } = await supabase
          .from('provider_transactions')
          .select('*')
          .eq('provider_id', providerData.id)
          .order('created_at', { ascending: false })
          .limit(10);

        setTransactions(transactionsData || []);
      }
    } catch (error) {
      console.error('Error fetching provider data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProviderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (provider) {
        // Update existing provider
        const { error } = await supabase
          .from('providers')
          .update(formData)
          .eq('id', provider.id);

        if (error) throw error;
        toast({ title: "Provider profile updated successfully!" });
      } else {
        // Create new provider
        const { data, error } = await supabase
          .from('providers')
          .insert({
            user_id: user.id,
            ...formData,
          })
          .select()
          .single();

        if (error) throw error;
        setProvider(data);
        toast({ title: "Provider profile created successfully!" });
      }
      
      await fetchProviderData();
    } catch (error: any) {
      toast({ 
        title: "Error saving provider profile", 
        description: error.message,
        variant: "destructive" 
      });
    }
  };

  const generateApiKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'xch_';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleCreateApiKey = async () => {
    if (!provider || !newKeyName.trim()) return;

    try {
      const apiKey = generateApiKey();
      const keyPrefix = apiKey.substring(0, 8) + '...';
      
      // Hash the key for storage (simple approach for demo)
      const keyHash = btoa(apiKey);

      const { error } = await supabase
        .from('api_keys')
        .insert({
          provider_id: provider.id,
          key_name: newKeyName,
          key_hash: keyHash,
          key_prefix: keyPrefix,
        });

      if (error) throw error;

      // Show the full key once to the user
      toast({ 
        title: "API Key Generated", 
        description: `Your API key: ${apiKey}. Copy it now, you won't see it again!` 
      });

      setNewKeyName('');
      setShowNewKeyForm(false);
      await fetchProviderData();
    } catch (error: any) {
      toast({ 
        title: "Error creating API key", 
        description: error.message,
        variant: "destructive" 
      });
    }
  };

  const handleRevokeKey = async (keyId: string) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ is_active: false })
        .eq('id', keyId);

      if (error) throw error;
      toast({ title: "API key revoked successfully" });
      await fetchProviderData();
    } catch (error: any) {
      toast({ 
        title: "Error revoking API key", 
        description: error.message,
        variant: "destructive" 
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!" });
  };

  const calculateBalance = () => {
    return transactions.reduce((sum, tx) => {
      if (tx.transaction_type === 'credit_earned') return sum + tx.amount;
      if (tx.transaction_type === 'payout') return sum - tx.amount;
      return sum;
    }, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">API & Provider Settings</h1>
            <p className="text-muted-foreground mt-2">
              Manage your provider profile, API keys, and earnings
            </p>
          </div>

          {/* Section 1: Provider Onboarding */}
          <Card>
            <CardHeader>
              <CardTitle>Provider Profile</CardTitle>
              <CardDescription>
                {provider ? 'Update your provider information' : 'Create your provider profile to start earning AI credits'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProviderSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="provider_name">Provider Name</Label>
                    <Input
                      id="provider_name"
                      value={formData.provider_name}
                      onChange={(e) => setFormData({ ...formData, provider_name: e.target.value })}
                      placeholder="Your AI Tool Name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website_url">Website URL</Label>
                    <Input
                      id="website_url"
                      type="url"
                      value={formData.website_url}
                      onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                      placeholder="https://yourtool.com"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    placeholder="contact@yourtool.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Short Description (max 50 characters)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of your AI tool"
                    maxLength={50}
                    rows={2}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    {formData.description.length}/50 characters
                  </p>
                </div>
                <Button type="submit" className="w-full md:w-auto">
                  {provider ? 'Update Provider Profile' : 'Create Provider Profile'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {provider && (
            <>
              {/* Section 2: API Keys */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>API Keys</CardTitle>
                      <CardDescription>
                        Manage your API keys for integrating Xchange.ai payments
                      </CardDescription>
                    </div>
                    <Button 
                      onClick={() => setShowNewKeyForm(true)}
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      New Key
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {showNewKeyForm && (
                    <Card className="bg-muted/30">
                      <CardContent className="pt-4">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Key name (e.g., Production, Development)"
                            value={newKeyName}
                            onChange={(e) => setNewKeyName(e.target.value)}
                          />
                          <Button onClick={handleCreateApiKey} disabled={!newKeyName.trim()}>
                            Generate
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setShowNewKeyForm(false);
                              setNewKeyName('');
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {apiKeys.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Key className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No API keys created yet</p>
                      <p className="text-sm">Create your first API key to start integrating</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {apiKeys.map((key) => (
                        <div key={key.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{key.key_name}</h4>
                              <Badge variant={key.is_active ? "default" : "secondary"}>
                                {key.is_active ? 'Active' : 'Revoked'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {key.key_prefix} • Created {format(new Date(key.created_at), 'MMM dd, yyyy')}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(key.key_prefix)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            {key.is_active && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRevokeKey(key.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">API Integration</h4>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm font-medium mb-2">Base API URL:</p>
                      <code className="text-sm bg-background px-2 py-1 rounded border">
                        https://api.xchange.ai/v1
                      </code>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm font-medium mb-2">Example Request:</p>
                      <pre className="text-xs bg-background p-3 rounded border overflow-x-auto">
{`curl -X POST https://api.xchange.ai/v1/payments \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 100,
    "currency": "USD",
    "description": "AI processing credits"
  }'`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Section 3: Provider Balance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Provider Balance
                  </CardTitle>
                  <CardDescription>
                    Track your earnings and transaction history
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Current Balance</p>
                          <p className="text-2xl font-bold">${calculateBalance().toFixed(2)}</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">This Month</p>
                          <p className="text-2xl font-bold text-green-600">+$0.00</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Total Earned</p>
                          <p className="text-2xl font-bold">${calculateBalance().toFixed(2)}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Recent Transactions
                    </h4>
                    {transactions.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No transactions yet</p>
                        <p className="text-sm">Earnings will appear here once users start using your API</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {transactions.map((tx) => (
                          <div key={tx.id} className="flex items-center justify-between p-3 border rounded">
                            <div>
                              <p className="font-medium">
                                {tx.transaction_type === 'credit_earned' && 'Credits Earned'}
                                {tx.transaction_type === 'payout' && 'Payout'}
                                {tx.transaction_type === 'fee' && 'Platform Fee'}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(tx.created_at), 'MMM dd, yyyy HH:mm')}
                              </p>
                              {tx.description && (
                                <p className="text-sm text-muted-foreground">{tx.description}</p>
                              )}
                            </div>
                            <div className={`font-medium ${
                              tx.transaction_type === 'credit_earned' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {tx.transaction_type === 'credit_earned' ? '+' : '-'}${tx.amount.toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProviderSettings;