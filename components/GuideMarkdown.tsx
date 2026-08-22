import type { ReactNode } from "react";

function safeHref(value: string) {
  if (value.startsWith("/") || value.startsWith("#")) return value;
  try { const url = new URL(value); return url.protocol === "http:" || url.protocol === "https:" ? value : null; } catch { return null; }
}

function inline(text: string): ReactNode[] {
  const tokens = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\)|`[^`]+`)/g);
  return tokens.map((token,index)=>{
    if(token.startsWith("**")&&token.endsWith("**"))return <strong key={index}>{token.slice(2,-2)}</strong>;
    if(token.startsWith("*")&&token.endsWith("*"))return <em key={index}>{token.slice(1,-1)}</em>;
    if(token.startsWith("`")&&token.endsWith("`"))return <code key={index} className="rounded bg-[var(--color-surface-subtle)] px-1">{token.slice(1,-1)}</code>;
    const link=token.match(/^\[([^\]]+)\]\(([^)]+)\)$/); if(link){const href=safeHref(link[2]);return href?<a key={index} href={href} rel={href.startsWith("http")?"noreferrer":undefined} className="underline">{link[1]}</a>:link[1];}
    return token;
  });
}

export function GuideMarkdown({ source }: { source: string }) {
  const lines=source.replace(/\r\n/g,"\n").split("\n"); const nodes:ReactNode[]=[];
  for(let i=0;i<lines.length;){const line=lines[i].trim(); if(!line){i++;continue;}
    const heading=line.match(/^(#{2,3})\s+(.+)$/); if(heading){const id=heading[2].toLowerCase().replace(/[^a-z0-9à-ÿ]+/gi,"-").replace(/^-|-$/g,""); nodes.push(heading[1].length===2?<h2 id={id} key={i} className="text-h2 mt-10 text-[var(--color-foreground)]">{inline(heading[2])}</h2>:<h3 id={id} key={i} className="text-h3 mt-8 text-[var(--color-foreground)]">{inline(heading[2])}</h3>);i++;continue;}
    if(/^[-*]\s+/.test(line)){const values:string[]=[];while(i<lines.length&&/^[-*]\s+/.test(lines[i].trim()))values.push(lines[i++].trim().replace(/^[-*]\s+/,""));nodes.push(<ul key={`u${i}`} className="my-5 list-disc space-y-2 pl-6">{values.map((v,k)=><li key={k}>{inline(v)}</li>)}</ul>);continue;}
    if(/^\d+\.\s+/.test(line)){const values:string[]=[];while(i<lines.length&&/^\d+\.\s+/.test(lines[i].trim()))values.push(lines[i++].trim().replace(/^\d+\.\s+/,""));nodes.push(<ol key={`o${i}`} className="my-5 list-decimal space-y-2 pl-6">{values.map((v,k)=><li key={k}>{inline(v)}</li>)}</ol>);continue;}
    if(line.startsWith("> ")){nodes.push(<blockquote key={i} className="my-6 border-l-2 border-[var(--color-accent)] pl-4 italic">{inline(line.slice(2))}</blockquote>);i++;continue;}
    const paragraph=[line];i++;while(i<lines.length&&lines[i].trim()&&!/^(#{2,3})\s+|^[-*]\s+|^\d+\.\s+|^>\s+/.test(lines[i].trim()))paragraph.push(lines[i++].trim());nodes.push(<p key={`p${i}`} className="text-body mt-5 leading-7 text-[var(--color-foreground-muted)]">{inline(paragraph.join(" "))}</p>);
  }
  return <div>{nodes}</div>;
}
