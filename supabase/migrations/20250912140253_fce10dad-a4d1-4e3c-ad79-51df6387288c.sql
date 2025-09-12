-- Create providers table
CREATE TABLE public.providers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_name TEXT NOT NULL,
  website_url TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  description TEXT NOT NULL CHECK (length(description) <= 50),
  logo_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create API keys table
CREATE TABLE public.api_keys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  key_name TEXT NOT NULL,
  key_hash TEXT NOT NULL UNIQUE,
  key_prefix TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_used_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(provider_id, key_name)
);

-- Create provider transactions table
CREATE TABLE public.provider_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('credit_earned', 'payout', 'fee')),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  reference_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for providers
CREATE POLICY "Users can view their own provider profile" 
ON public.providers 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own provider profile" 
ON public.providers 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own provider profile" 
ON public.providers 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for API keys
CREATE POLICY "Providers can manage their own API keys" 
ON public.api_keys 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.providers 
    WHERE providers.id = api_keys.provider_id 
    AND providers.user_id = auth.uid()
  )
);

-- Create RLS policies for provider transactions
CREATE POLICY "Providers can view their own transactions" 
ON public.provider_transactions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.providers 
    WHERE providers.id = provider_transactions.provider_id 
    AND providers.user_id = auth.uid()
  )
);

-- Create triggers for updated_at
CREATE TRIGGER update_providers_updated_at
BEFORE UPDATE ON public.providers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_providers_user_id ON public.providers(user_id);
CREATE INDEX idx_api_keys_provider_id ON public.api_keys(provider_id);
CREATE INDEX idx_provider_transactions_provider_id ON public.provider_transactions(provider_id);
CREATE INDEX idx_provider_transactions_created_at ON public.provider_transactions(created_at DESC);