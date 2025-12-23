import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Globe, Lock } from "lucide-react";
import React from "react";

interface IdentityBrandingProps {
  org_name: string;
  domain: string;
}

const IdentityBranding = ({ org_name, domain }: IdentityBrandingProps) => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-semibold">Identity & Branding</h1>
        <p className="text-sm text-muted-foreground">
          View your workspace details and manage branding assets or domains.
        </p>
      </div>

      <div className="flex gap-6">
        <Avatar className="w-32 h-32 rounded-none">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        </Avatar>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h2 className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
              Workspace Name
            </h2>
            <div className="flex items-center justify-between border-b border-border">
              <p className="text-xl font-semibold">{org_name}</p>
              <Lock
                className="text-muted-foreground w-4 h-4"
                strokeWidth={2.5}
              />
            </div>
          </div>

          <div>
            <h2 className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
              Domain
            </h2>
            <InputGroup className="rounded-none border-0 border-b border-border shadow-none">
              <InputGroupAddon align={"inline-start"} className="pl-0">
                <Globe
                  className="w-3 h-3 text-muted-foreground"
                  strokeWidth={2}
                />
              </InputGroupAddon>
              <InputGroupInput value={domain} disabled />
            </InputGroup>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdentityBranding;
