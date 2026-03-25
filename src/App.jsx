import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://tsculwqfgjyjjautnvwf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzY3Vsd3FmZ2p5amphdXRudndmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNzQ4NTUsImV4cCI6MjA4OTk1MDg1NX0.r2IUeaFqHq-Uf51e9bqzpRostRfTbtJr9mqkwGz4I0I"
);

/* ─────────────────────────────────────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────────────────────────────────────── */
const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,800;1,9..144,400&family=Outfit:wght@300;400;500;600;700&display=swap');

    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
    html{-webkit-text-size-adjust:100%}

    :root{
      --bg:#f4f1ec;
      --surface:#ffffff;
      --surface2:#ede9e2;
      --border:#ddd8cf;
      --brand:#1b6e4a;
      --brand-hover:#1f8558;
      --brand-dark:#124d34;
      --brand-dim:rgba(27,110,74,.09);
      --emerald:#6ee7b7;
      --text:#1a1714;
      --muted:#79736a;
      --dim:#b5ada5;
      --red:#c23b2e;
      --green:#1a7a49;
      --blue:#2460a7;
      --orange:#d4621f;
      --ff:'Fraunces',serif;
      --fb:'Outfit',sans-serif;
      --r:10px;
      --r-sm:7px;
      --sh:0 1px 4px rgba(0,0,0,.07),0 4px 16px rgba(0,0,0,.05);
      --safe-t:env(safe-area-inset-top,0px);
      --safe-b:env(safe-area-inset-bottom,0px);
    }

    body{background:var(--bg);color:var(--text);font-family:var(--fb);font-size:14px;
      line-height:1.6;-webkit-font-smoothing:antialiased;overscroll-behavior:none}

    /* ── Layout ── */
    .shell{display:flex;min-height:100vh;min-height:100dvh}

    /* ── Sidebar ── */
    .sidebar{
      width:234px;background:var(--brand-dark);
      display:flex;flex-direction:column;
      position:fixed;inset:0 auto 0 0;z-index:200;
      transition:transform .24s cubic-bezier(.4,0,.2,1);
    }
    .sb-logo{padding:22px 20px 16px;border-bottom:1px solid rgba(255,255,255,.1);flex-shrink:0}
    .sb-logo h1{font-family:var(--ff);font-size:19px;color:#fff;font-weight:800;line-height:1.15}
    .sb-logo h1 span{color:var(--emerald)}
    .sb-logo em{font-size:11px;color:rgba(255,255,255,.38);font-style:italic;
      font-family:var(--ff);display:block;margin-top:3px}
    .sb-nav{flex:1;padding:8px 0;overflow-y:auto}
    .sb-section{padding:14px 20px 3px;font-size:10px;color:rgba(255,255,255,.25);
      letter-spacing:1.6px;text-transform:uppercase;font-weight:700}
    .sb-item{display:flex;align-items:center;gap:10px;padding:10px 20px;
      cursor:pointer;color:rgba(255,255,255,.52);font-size:13.5px;font-weight:400;
      transition:all .14s;border-left:3px solid transparent;min-height:44px;user-select:none}
    .sb-item:hover{color:rgba(255,255,255,.9);background:rgba(255,255,255,.07)}
    .sb-item.on{color:var(--emerald);background:rgba(110,231,183,.1);border-left-color:var(--emerald);font-weight:600}
    .sb-icon{width:18px;flex-shrink:0;display:flex;align-items:center;justify-content:center}
    .sb-foot{padding:14px 20px calc(14px + var(--safe-b));border-top:1px solid rgba(255,255,255,.1);
      font-size:11px;color:rgba(255,255,255,.28);line-height:1.8;flex-shrink:0}

    /* ── Sidebar overlay (mobile) ── */
    .sb-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:199}
    .sb-overlay.show{display:block}

    /* ── Topbar ── */
    .topbar{
      height:54px;background:var(--surface);border-bottom:1px solid var(--border);
      display:flex;align-items:center;justify-content:space-between;
      padding:0 22px;position:fixed;
      top:var(--safe-t);left:234px;right:0;z-index:100;
      box-shadow:0 1px 0 var(--border),0 2px 8px rgba(0,0,0,.04);
    }
    .tb-l{display:flex;align-items:center;gap:10px}
    .tb-r{display:flex;align-items:center;gap:12px}
    .tb-title{font-family:var(--ff);font-size:15px;font-weight:600;color:var(--text)}
    .tb-name{font-size:12.5px;color:var(--muted);font-weight:500}
    .tb-avatar{width:32px;height:32px;border-radius:50%;background:var(--brand-dim);
      border:2px solid var(--brand);display:flex;align-items:center;justify-content:center;
      font-size:11px;color:var(--brand);font-weight:700;cursor:pointer;flex-shrink:0}
    .tb-out{font-size:12px;color:var(--dim);cursor:pointer;font-weight:500;
      padding:5px 9px;border-radius:6px;border:1px solid var(--border);
      background:transparent;font-family:var(--fb);transition:all .14s}
    .tb-out:hover{color:var(--red);border-color:rgba(194,59,46,.3)}
    .menu-btn{display:none;background:none;border:none;cursor:pointer;
      padding:8px;color:var(--muted);border-radius:6px;
      align-items:center;justify-content:center;min-width:40px;min-height:40px}

    /* ── Main ── */
    .main{
      margin-left:234px;
      padding-top:calc(54px + var(--safe-t) + 22px);
      padding-bottom:28px;
      padding-left:24px;
      padding-right:24px;
      flex:1;min-width:0;
    }

    /* ── Bottom nav (mobile only) ── */
    .bot-nav{
      display:none;position:fixed;bottom:0;left:0;right:0;
      background:var(--brand-dark);
      border-top:1px solid rgba(255,255,255,.1);
      padding-bottom:var(--safe-b);z-index:100;
    }
    .bot-nav-inner{display:flex}
    .bot-item{
      flex:1;display:flex;flex-direction:column;align-items:center;
      justify-content:center;gap:3px;padding:8px 2px 9px;
      cursor:pointer;color:rgba(255,255,255,.38);
      font-size:9.5px;font-weight:600;letter-spacing:.4px;
      text-transform:uppercase;transition:color .14s;user-select:none;min-height:52px;
    }
    .bot-item.on{color:var(--emerald)}

    /* ── Page header ── */
    .ph{display:flex;align-items:flex-start;justify-content:space-between;
      margin-bottom:20px;gap:12px;flex-wrap:wrap}
    .ph-title{font-family:var(--ff);font-size:24px;color:var(--text);font-weight:800}
    .ph-sub{color:var(--muted);font-size:12.5px;margin-top:2px}

    /* ── Cards ── */
    .card{background:var(--surface);border:1px solid var(--border);
      border-radius:var(--r);padding:20px;box-shadow:var(--sh)}
    .card-xs{padding:14px 16px}

    /* ── Grids ── */
    .g4{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:18px}
    .g3{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
    .g2{display:grid;grid-template-columns:1fr 1fr;gap:16px}

    /* ── Stats ── */
    .sl{font-size:10.5px;color:var(--muted);text-transform:uppercase;
      letter-spacing:1px;font-weight:600;margin-bottom:5px}
    .sv{font-family:var(--ff);font-size:22px;color:var(--text);line-height:1.1}
    .sv.g{color:var(--green)}.sv.r{color:var(--red)}.sv.b{color:var(--brand)}
    .ss{font-size:11.5px;color:var(--muted);margin-top:3px}

    /* ── Badges ── */
    .badge{display:inline-flex;align-items:center;font-size:10.5px;
      padding:2px 8px;border-radius:20px;font-weight:600;white-space:nowrap;vertical-align:middle}
    .bg-g{background:rgba(26,122,73,.1);color:var(--green)}
    .bg-r{background:rgba(194,59,46,.1);color:var(--red)}
    .bg-b{background:rgba(36,96,167,.1);color:var(--blue)}
    .bg-br{background:var(--brand-dim);color:var(--brand)}
    .bg-o{background:rgba(212,98,31,.1);color:var(--orange)}

    /* ── Table ── */
    .tscroll{overflow-x:auto;-webkit-overflow-scrolling:touch}
    table{width:100%;border-collapse:collapse}
    th{text-align:left;padding:9px 13px;font-size:10.5px;color:var(--muted);
      text-transform:uppercase;letter-spacing:1px;font-weight:600;
      border-bottom:2px solid var(--border);white-space:nowrap}
    td{padding:11px 13px;border-bottom:1px solid var(--surface2);
      font-size:13px;vertical-align:middle}
    tr:last-child td{border-bottom:none}
    tr:hover td{background:var(--brand-dim)}
    .tmono{font-variant-numeric:tabular-nums;font-weight:500}

    /* ── Buttons ── */
    .btn{display:inline-flex;align-items:center;gap:6px;padding:9px 16px;
      border-radius:var(--r-sm);font-size:13.5px;font-family:var(--fb);
      font-weight:600;cursor:pointer;border:none;transition:all .14s;
      white-space:nowrap;min-height:42px;user-select:none;line-height:1}
    .btn-p{background:var(--brand);color:#fff}
    .btn-p:hover{background:var(--brand-hover)}
    .btn-g{background:transparent;color:var(--muted);border:1.5px solid var(--border)}
    .btn-g:hover{color:var(--text);background:var(--surface2)}
    .btn-d{background:rgba(194,59,46,.08);color:var(--red);border:1px solid rgba(194,59,46,.2)}
    .btn-d:hover{background:rgba(194,59,46,.14)}
    .btn-sm{padding:6px 11px;font-size:12px;min-height:34px;border-radius:6px}
    .btn-blk{width:100%;justify-content:center}
    .btn:disabled{opacity:.45;cursor:not-allowed}

    /* ── Forms ── */
    .fstack{display:flex;flex-direction:column;gap:15px}
    .frow{display:grid;grid-template-columns:1fr 1fr;gap:13px}
    .frow3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:13px}
    .field label{display:block;font-size:10.5px;color:var(--muted);
      text-transform:uppercase;letter-spacing:1px;margin-bottom:5px;font-weight:600}
    .fhint{font-size:11px;color:var(--dim);margin-top:4px}
    input,select,textarea{
      width:100%;background:var(--bg);border:1.5px solid var(--border);
      border-radius:var(--r-sm);padding:10px 12px;color:var(--text);
      font-family:var(--fb);font-size:14px;transition:all .14s;
      outline:none;appearance:none;-webkit-appearance:none;min-height:42px;
    }
    input:focus,select:focus,textarea:focus{
      border-color:var(--brand);box-shadow:0 0 0 3px var(--brand-dim);background:#fff}
    textarea{resize:vertical;min-height:76px;min-height:unset}

    /* ── Section head ── */
    .sh2{display:flex;align-items:center;justify-content:space-between;
      margin-bottom:15px;flex-wrap:wrap;gap:8px}
    .sh2-title{font-family:var(--ff);font-size:16px;color:var(--text);font-weight:700}

    /* ── Divider ── */
    .hr{border:none;border-top:1px solid var(--border);margin:15px 0}

    /* ── Progress ── */
    .prog-track{background:var(--surface2);border-radius:4px;height:6px;overflow:hidden;margin-top:7px}
    .prog-fill{height:100%;border-radius:4px;background:var(--brand);transition:width .5s}

    /* ── Tabs ── */
    .tabs{display:flex;gap:3px;margin-bottom:16px;background:var(--surface2);
      padding:3px;border-radius:9px;width:fit-content;max-width:100%;overflow-x:auto}
    .tab{padding:7px 15px;border-radius:7px;font-size:13px;cursor:pointer;
      color:var(--muted);font-weight:500;transition:all .14s;
      white-space:nowrap;min-height:36px;display:flex;align-items:center}
    .tab.on{background:var(--brand);color:#fff;font-weight:600}

    /* ── BAS ── */
    .bas-card{background:var(--surface);border:1.5px solid var(--border);
      border-radius:var(--r);padding:16px;box-shadow:var(--sh)}
    .bas-ql{font-size:10.5px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;font-weight:600}
    .bas-qp{font-size:11.5px;color:var(--muted);margin:3px 0 12px}
    .bas-row{display:flex;justify-content:space-between;align-items:center;
      padding:6px 0;font-size:12.5px;border-bottom:1px solid var(--surface2)}
    .bas-row:last-of-type{border-bottom:none}
    .bas-net{font-family:var(--ff);font-size:19px;margin-top:8px;font-weight:700}

    /* ── Invoice preview ── */
    .inv-wrap{background:#fff;color:#111;border-radius:var(--r);padding:32px;
      font-family:var(--fb);border:1px solid var(--border);
      box-shadow:0 4px 24px rgba(0,0,0,.09)}
    .inv-hd{display:flex;justify-content:space-between;align-items:flex-start;
      margin-bottom:24px;gap:16px;flex-wrap:wrap}
    .inv-co{font-family:var(--ff);font-size:19px;color:#1b6e4a;font-weight:800}
    .inv-tag{font-size:10.5px;color:#888;font-style:italic;font-family:var(--ff)}
    .inv-lbl{font-family:var(--ff);font-size:22px;color:#1a1714;font-weight:800}
    .inv-meta{font-size:11.5px;color:#666;margin-top:2px}
    .inv-wrap table{min-width:unset}
    .inv-wrap th{background:#f4f1ec;padding:7px 10px;font-size:10.5px;
      color:#555;text-transform:uppercase;letter-spacing:.8px;font-weight:600}
    .inv-wrap td{padding:8px 10px;border-bottom:1px solid #eee;font-size:12.5px;color:#222}
    .inv-tr{display:flex;justify-content:space-between;padding:5px 0;font-size:12.5px;color:#555}
    .inv-tr.fin{font-size:15px;font-weight:700;color:#111;
      border-top:2px solid #1b6e4a;padding-top:10px;margin-top:3px}
    .inv-ft{margin-top:24px;font-size:10.5px;color:#888;
      border-top:1px solid #eee;padding-top:13px}

    /* ── Item cards (mobile list) ── */
    .icard{background:var(--surface);border:1px solid var(--border);
      border-radius:var(--r);padding:15px;box-shadow:var(--sh)}
    .icard-top{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin-bottom:10px}
    .icard-name{font-weight:600;font-size:14px;line-height:1.3}
    .icard-sub{font-size:11.5px;color:var(--muted);margin-top:2px}
    .icard-bot{display:flex;justify-content:space-between;align-items:center;
      padding-top:10px;border-top:1px solid var(--surface2);gap:10px;flex-wrap:wrap}
    .icard-amt{font-family:var(--ff);font-size:19px;font-weight:700;color:var(--text)}
    .icard-gst{font-size:11px;color:var(--muted);margin-top:1px}

    /* ── Upload / AI Scanner ── */
    .drop-zone{
      border:2px dashed var(--border);border-radius:var(--r);
      padding:36px 24px;text-align:center;cursor:pointer;
      transition:all .2s;background:var(--surface);
    }
    .drop-zone:hover,.drop-zone.drag{
      border-color:var(--brand);background:var(--brand-dim);
    }
    .drop-zone.drag{transform:scale(1.01)}
    .drop-icon{font-size:36px;margin-bottom:10px;line-height:1}
    .drop-title{font-family:var(--ff);font-size:17px;font-weight:700;color:var(--text);margin-bottom:5px}
    .drop-sub{font-size:13px;color:var(--muted)}
    .drop-types{font-size:11px;color:var(--dim);margin-top:6px}

    /* AI result card */
    .ai-result{
      background:var(--surface);border:1.5px solid var(--brand);
      border-radius:var(--r);padding:20px;box-shadow:0 0 0 4px var(--brand-dim);
      animation:slideIn .25s ease;
    }
    @keyframes slideIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
    .ai-header{display:flex;align-items:center;gap:10px;margin-bottom:16px}
    .ai-badge{background:var(--brand);color:#fff;font-size:11px;font-weight:700;
      padding:3px 9px;border-radius:20px;letter-spacing:.5px}
    .ai-title{font-family:var(--ff);font-size:16px;font-weight:700;color:var(--text)}
    .ai-field{margin-bottom:12px}
    .ai-field label{font-size:10.5px;color:var(--muted);text-transform:uppercase;
      letter-spacing:1px;font-weight:600;display:block;margin-bottom:4px}
    .ai-note{font-size:12px;color:var(--muted);background:var(--surface2);
      border-radius:6px;padding:10px 12px;margin-top:8px;line-height:1.6}
    .pulse{animation:pulse 1.5s infinite}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}

    /* ── Scrollbar ── */
    ::-webkit-scrollbar{width:5px;height:5px}
    ::-webkit-scrollbar-track{background:transparent}
    ::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px}

    /* ── Auth ── */
    .auth-shell{min-height:100vh;min-height:100dvh;display:grid;grid-template-columns:1fr 1fr}
    .auth-brand{
      background:var(--brand-dark);display:flex;flex-direction:column;
      justify-content:space-between;padding:52px 56px;
      position:relative;overflow:hidden;
    }
    .auth-brand::after{content:'';position:absolute;bottom:-80px;left:-80px;
      width:340px;height:340px;border-radius:50%;
      background:rgba(110,231,183,.06);pointer-events:none}
    .ab-logo{font-family:var(--ff);font-size:26px;color:#fff;font-weight:800;line-height:1}
    .ab-logo span{color:var(--emerald)}
    .ab-sub{font-size:11.5px;color:rgba(255,255,255,.38);font-style:italic;
      font-family:var(--ff);margin-top:5px;display:block}
    .ab-hl{font-family:var(--ff);font-size:36px;line-height:1.15;color:#fff;font-weight:800}
    .ab-hl em{color:var(--emerald);font-style:italic}
    .ab-body{font-size:13.5px;color:rgba(255,255,255,.48);margin-top:13px;line-height:1.8}
    .ab-feats{display:flex;flex-direction:column;gap:10px;margin-top:28px}
    .ab-feat{display:flex;align-items:center;gap:11px;font-size:13px;color:rgba(255,255,255,.58)}
    .ab-dot{width:6px;height:6px;border-radius:50%;background:var(--emerald);flex-shrink:0}
    .ab-foot{font-size:10.5px;color:rgba(255,255,255,.2)}
    .auth-mob-hd{
      display:none;
      background:var(--brand-dark);
      padding:calc(36px + var(--safe-t)) 28px 36px;
      text-align:center;
      position:relative;
      overflow:hidden;
    }
    .auth-mob-circle1{position:absolute;top:-60px;right:-60px;
      width:220px;height:220px;border-radius:50%;
      background:rgba(110,231,183,.06);pointer-events:none;}
    .auth-mob-circle2{position:absolute;bottom:-50px;left:-50px;
      width:160px;height:160px;border-radius:50%;
      background:rgba(110,231,183,.04);pointer-events:none;}
    .auth-mob-logo{font-family:var(--ff);font-size:34px;color:#fff;font-weight:800;letter-spacing:-.5px;line-height:1}
    .auth-mob-logo span{color:var(--emerald)}
    .auth-mob-sub{font-size:13px;color:rgba(255,255,255,.42);font-style:italic;font-family:var(--ff);margin-top:8px}
    .auth-panel{display:flex;flex-direction:column;justify-content:center;
      align-items:center;padding:44px 48px;background:var(--bg);overflow-y:auto}
    .auth-box{width:100%;max-width:400px}
    .auth-title{font-family:var(--ff);font-size:24px;color:var(--text);font-weight:800;margin-bottom:4px}
    .auth-sub{font-size:13px;color:var(--muted);margin-bottom:24px}
    .auth-form{display:flex;flex-direction:column;gap:14px}
    .auth-lrow{display:flex;justify-content:space-between;align-items:center;margin-bottom:5px}
    .auth-lrow label{margin-bottom:0}
    .auth-forgot{font-size:11.5px;color:var(--muted);cursor:pointer}
    .auth-forgot:hover{color:var(--brand)}
    .auth-btn{width:100%;padding:13px;border-radius:var(--r-sm);font-size:14.5px;
      font-family:var(--fb);font-weight:700;cursor:pointer;border:none;
      background:var(--brand);color:#fff;transition:all .14s;min-height:48px}
    .auth-btn:hover{background:var(--brand-hover)}
    .auth-btn:disabled{opacity:.45;cursor:not-allowed}
    .auth-btn-ghost{background:var(--surface2);color:var(--muted);border:1.5px solid var(--border) !important}
    .auth-err{background:rgba(194,59,46,.08);border:1px solid rgba(194,59,46,.2);
      color:var(--red);font-size:12.5px;padding:10px 13px;border-radius:var(--r-sm)}
    .auth-sw{font-size:13px;color:var(--muted);text-align:center;margin-top:18px}
    .auth-sw a{color:var(--brand);cursor:pointer;font-weight:700;text-decoration:none}
    .pills{display:flex;gap:5px;margin-bottom:22px}
    .pill{height:4px;border-radius:2px;flex:1;background:var(--border);transition:background .3s}
    .pill.done{background:var(--brand)}.pill.active{background:var(--brand-hover)}
    .plan-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px}
    .plan-card{border:1.5px solid var(--border);border-radius:var(--r-sm);padding:14px;
      cursor:pointer;transition:all .14s;background:var(--surface)}
    .plan-card:hover,.plan-card.sel{border-color:var(--brand);background:var(--brand-dim)}
    .plan-name{font-weight:700;font-size:13.5px;color:var(--text);margin-bottom:2px}
    .plan-price{font-family:var(--ff);font-size:19px;color:var(--brand);font-weight:800}
    .plan-desc{font-size:11px;color:var(--muted);margin-top:4px;line-height:1.5}

    /* ── Onboarding Tour ── */
    .tour-overlay{position:fixed;inset:0;z-index:999;pointer-events:none}
    .tour-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:998}
    .tour-spotlight{position:fixed;border-radius:10px;box-shadow:0 0 0 9999px rgba(0,0,0,.55);z-index:999;pointer-events:none;transition:all .3s ease}
    .tour-card{position:fixed;z-index:1000;background:var(--brand-dark);color:#fff;
      border-radius:14px;padding:22px 22px 18px;max-width:320px;width:calc(100vw - 40px);
      box-shadow:0 8px 32px rgba(0,0,0,.35);pointer-events:all}
    .tour-badge{font-size:10px;color:var(--emerald);font-weight:700;letter-spacing:1.2px;
      text-transform:uppercase;margin-bottom:8px}
    .tour-title{font-family:var(--ff);font-size:20px;font-weight:800;margin-bottom:8px;line-height:1.2}
    .tour-body{font-size:13px;color:rgba(255,255,255,.65);line-height:1.7;margin-bottom:18px}
    .tour-footer{display:flex;justify-content:space-between;align-items:center;gap:12px}
    .tour-dots{display:flex;gap:5px}
    .tour-dot{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.25);transition:background .2s}
    .tour-dot.on{background:var(--emerald)}
    .tour-next{background:var(--emerald);color:var(--brand-dark);border:none;border-radius:7px;
      padding:9px 18px;font-weight:700;font-size:13.5px;cursor:pointer;font-family:var(--fb)}
    .tour-skip{font-size:12px;color:rgba(255,255,255,.35);cursor:pointer;background:none;border:none;font-family:var(--fb)}
    .tour-next:hover{opacity:.9}

    /* ── Chatbot ── */
    .chat-fab{position:fixed;bottom:calc(70px + var(--safe-b));right:20px;z-index:500;
      width:56px;height:56px;border-radius:50%;background:var(--brand-dark);
      border:none;cursor:pointer;box-shadow:0 4px 20px rgba(0,0,0,.25);
      display:flex;align-items:center;justify-content:center;transition:transform .18s}
    .chat-fab:hover{transform:scale(1.08)}
    .chat-fab-inner{position:relative;width:38px;height:38px}
    .chat-unread{position:absolute;top:-3px;right:-3px;width:14px;height:14px;
      border-radius:50%;background:var(--red);border:2px solid var(--surface);
      font-size:8px;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700}
    .chat-window{position:fixed;bottom:calc(138px + var(--safe-b));right:20px;z-index:500;
      width:360px;max-width:calc(100vw - 28px);background:var(--surface);
      border-radius:16px;box-shadow:0 8px 40px rgba(0,0,0,.18);
      display:flex;flex-direction:column;overflow:hidden;
      border:1px solid var(--border);max-height:520px}
    .chat-header{background:var(--brand-dark);padding:14px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0}
    .chat-header-text{flex:1}
    .chat-header-name{font-weight:700;font-size:14px;color:#fff;font-family:var(--ff)}
    .chat-header-status{font-size:11px;color:var(--emerald);margin-top:1px}
    .chat-messages{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px}
    .chat-msg{max-width:86%;line-height:1.55}
    .chat-msg.user{align-self:flex-end;background:var(--brand);color:#fff;padding:9px 13px;border-radius:14px 14px 3px 14px;font-size:13px}
    .chat-msg.bot{align-self:flex-start;background:var(--surface2);color:var(--text);padding:9px 13px;border-radius:14px 14px 14px 3px;font-size:13px}
    .chat-msg.bot .chat-elephant{font-size:16px;margin-bottom:3px}
    .chat-suggestions{display:flex;flex-wrap:wrap;gap:6px;padding:0 14px 10px}
    .chat-sug{background:var(--brand-dim);color:var(--brand);border:1px solid rgba(27,110,74,.2);
      border-radius:20px;padding:5px 11px;font-size:12px;cursor:pointer;font-family:var(--fb);
      transition:all .14s;white-space:nowrap}
    .chat-sug:hover{background:var(--brand);color:#fff}
    .chat-input-row{display:flex;gap:8px;padding:10px 12px;border-top:1px solid var(--border);flex-shrink:0}
    .chat-input{flex:1;border:1.5px solid var(--border);border-radius:20px;
      padding:8px 14px;font-size:13px;font-family:var(--fb);background:var(--bg);
      color:var(--text);outline:none;transition:border .14s}
    .chat-input:focus{border-color:var(--brand)}
    .chat-send{width:36px;height:36px;border-radius:50%;background:var(--brand);
      border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;
      transition:background .14s;flex-shrink:0}
    .chat-send:hover{background:var(--brand-hover)}
    .chat-typing{display:flex;gap:4px;align-items:center;padding:3px 0}
    .chat-typing span{width:6px;height:6px;border-radius:50%;background:var(--muted);animation:typing 1.2s infinite}
    .chat-typing span:nth-child(2){animation-delay:.2s}
    .chat-typing span:nth-child(3){animation-delay:.4s}
    @keyframes typing{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}
    @media(max-width:780px){
      .chat-fab{bottom:calc(62px + var(--safe-b));right:14px}
      .chat-window{bottom:calc(130px + var(--safe-b));right:14px;width:calc(100vw - 28px)}
    }
    .hecs-toggle{display:flex;align-items:center;gap:10px;cursor:pointer;user-select:none}
    .hecs-toggle-track{width:42px;height:24px;border-radius:12px;background:var(--border);
      transition:background .2s;position:relative;flex-shrink:0}
    .hecs-toggle-track.on{background:var(--brand)}
    .hecs-toggle-thumb{position:absolute;top:3px;left:3px;width:18px;height:18px;
      border-radius:50%;background:#fff;transition:transform .2s;
      box-shadow:0 1px 3px rgba(0,0,0,.2)}
    .hecs-toggle-track.on .hecs-toggle-thumb{transform:translateX(18px)}
    .role-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:4px}
    .role-card{border:1.5px solid var(--border);border-radius:var(--r-sm);padding:16px;cursor:pointer;transition:all .14s;background:var(--surface);text-align:center}
    .role-card:hover,.role-card.sel{border-color:var(--brand);background:var(--brand-dim)}
    .role-card-icon{font-size:28px;margin-bottom:8px}
    .role-card-name{font-weight:700;font-size:14px;color:var(--text)}
    .role-card-desc{font-size:11.5px;color:var(--muted);margin-top:4px;line-height:1.5}
    .acct-banner{background:var(--brand-dark);color:#fff;padding:10px 24px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;position:fixed;top:calc(54px + var(--safe-t));left:234px;right:0;z-index:49;font-size:13px}
    .acct-banner-label{display:flex;align-items:center;gap:8px}
    .acct-banner em{color:var(--emerald);font-style:normal;font-weight:700}
    .client-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:18px;box-shadow:var(--sh);cursor:pointer;transition:all .14s}
    .client-card:hover{border-color:var(--brand);background:var(--brand-dim);transform:translateY(-1px)}
    .client-card-name{font-family:var(--ff);font-size:16px;font-weight:700;color:var(--text);margin-bottom:3px}
    .client-card-abn{font-size:12px;color:var(--muted)}
    .client-card-stats{display:flex;gap:16px;margin-top:12px;padding-top:12px;border-top:1px solid var(--surface2)}
    .client-stat{text-align:center}
    .client-stat-val{font-family:var(--ff);font-size:15px;font-weight:700;color:var(--text)}
    .client-stat-lbl{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.8px;margin-top:2px}
    .pending-invite{background:var(--surface);border:1.5px dashed var(--border);border-radius:var(--r);padding:16px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
    @media(max-width:780px){
      .acct-banner{left:0;top:calc(54px + var(--safe-t))}
      .acct-banner-has-banner .main{padding-top:calc(54px + var(--safe-t) + 44px + 14px) !important}
      .role-grid{grid-template-columns:1fr}
    }

    /* Tablet */
    @media(max-width:1060px){
      .sidebar{width:200px}
      .topbar{left:200px}
      .main{margin-left:200px}
      .g4{grid-template-columns:1fr 1fr}
    }

    /* Mobile */
    @media(max-width:780px){
      .sidebar{transform:translateX(-100%);width:260px}
      .sidebar.open{transform:translateX(0);box-shadow:6px 0 28px rgba(0,0,0,.22)}
      .topbar{left:0;padding:0 14px}
      .menu-btn{display:flex}
      .tb-name,.tb-out{display:none}
      .main{
        margin-left:0;
        padding-top:calc(54px + var(--safe-t) + 14px);
        padding-bottom:calc(52px + var(--safe-b) + 12px);
        padding-left:14px;
        padding-right:14px;
      }
      .bot-nav{display:block}
      .g4{grid-template-columns:1fr 1fr;gap:9px;margin-bottom:14px}
      .g2{grid-template-columns:1fr}
      .g3{grid-template-columns:1fr 1fr}
      .ph-title{font-size:20px}
      .card{padding:14px}
      .sv{font-size:19px}
      .frow,.frow3{grid-template-columns:1fr}
      .auth-shell{grid-template-columns:1fr}
      .auth-brand{display:none}
      .auth-mob-hd{display:block}
      .auth-panel{padding:24px 20px calc(24px + var(--safe-b));justify-content:flex-start;background:var(--bg)}
      .auth-box{padding-top:4px}
      .auth-title{font-size:21px}
      .bas-g4{grid-template-columns:1fr 1fr !important;gap:10px !important}
      .inv-wrap{padding:18px}
      .inv-lbl{font-size:18px}
      .line-items-grid{grid-template-columns:1fr !important}
    }

    @media(max-width:430px){
      .g4{grid-template-columns:1fr 1fr}
      .g3{grid-template-columns:1fr}
      .bas-g4{grid-template-columns:1fr !important}
      .plan-grid{grid-template-columns:1fr}
      .main{padding-left:11px;padding-right:11px}
    }
  `}</style>
);

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const fmt   = n => "$"+Number(n||0).toLocaleString("en-AU",{minimumFractionDigits:2,maximumFractionDigits:2});
const today = () => new Date().toISOString().slice(0,10);
const addD  = (d,n) => { const dt=new Date(d); dt.setDate(dt.getDate()+n); return dt.toISOString().slice(0,10); };
const fmtD  = d => d?new Date(d).toLocaleDateString("en-AU",{day:"2-digit",month:"short",year:"numeric"}):"";
const GST   = 0.1;
const ci    = inv => { const s=inv.items.reduce((a,i)=>a+i.qty*i.unit,0); const g=inv.items.reduce((a,i)=>a+(i.gst?i.qty*i.unit*GST:0),0); return{s,g,t:s+g}; };
const nid   = arr => Math.max(0,...arr.map(x=>x.id))+1;

/* ─── Seed ───────────────────────────────────────────────────────────────── */
// No seed data - all data loads from Supabase per user
const ACCTS = [];

/* ─── Icons ──────────────────────────────────────────────────────────────── */
const Ic = {
  dash:    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
  inv:     <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  exp:     <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
  gst:     <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  bas:     <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/></svg>,
  upload:  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17,8 12,3 7,8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  plus:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  trash:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3,6 5,6 21,6"/><path d="M19,6l-1,14H6L5,6"/><path d="M10,11v6M14,11v6"/><path d="M9,6V4h6v2"/></svg>,
  eye:     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  dl:      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  back:    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15,18 9,12 15,6"/></svg>,
  menu:    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  tax:     <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/><line x1="9" y1="9" x2="10" y2="9"/></svg>,
  payg:    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>,
  clients: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  spark:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2"/></svg>,
  close:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
};

const SBadge = ({s}) => {
  const m={paid:"bg-g",sent:"bg-b",overdue:"bg-r",draft:"bg-o"};
  return <span className={`badge ${m[s]||"bg-br"}`}>{s}</span>;
};

/* ══════════════════════════════════════════════════════════════════════════
   AI DOCUMENT SCANNER
══════════════════════════════════════════════════════════════════════════ */
const CATS = ["Software","Professional","Marketing","Travel","Office","Utilities","Equipment","Insurance","Subscriptions","Food & Beverage","Other"];

function fileToBase64(file) {
  return new Promise((res,rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result.split(",")[1]);
    r.onerror = () => rej(new Error("Read failed"));
    r.readAsDataURL(file);
  });
}

function AIScanner({ onConfirm, onCancel }) {
  const [drag, setDrag]         = useState(false);
  const [loading, setLoading]   = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiNote, setAiNote]     = useState("");
  const [error, setError]       = useState("");
  const [form, setForm]         = useState(null);
  const [fileName, setFileName] = useState("");
  const fileRef = useRef();

  const processFile = useCallback(async (file) => {
    if (!file) return;
    const allowed = ["image/jpeg","image/png","image/webp","image/gif","application/pdf"];
    if (!allowed.includes(file.type)) { setError("Please upload an image (JPG, PNG, WEBP) or PDF."); return; }
    setError(""); setLoading(true); setAiResult(null); setFileName(file.name);

    try {
      const b64  = await fileToBase64(file);
      const isPDF = file.type === "application/pdf";

      const content = isPDF
        ? [
            { type:"document", source:{ type:"base64", media_type:"application/pdf", data:b64 } },
            { type:"text",     text:`You are an Australian bookkeeping assistant. Analyse this document (receipt, invoice, or statement) and extract expense details. Reply ONLY with valid JSON — no explanation, no markdown. Format:\n{"description":"...","amount":0.00,"date":"YYYY-MM-DD","category":"${CATS.join("|")}","gstIncluded":true|false,"gstAmount":0.00,"vendor":"...","note":"one sentence about this expense and why you categorised it this way"}` }
          ]
        : [
            { type:"image", source:{ type:"base64", media_type:file.type, data:b64 } },
            { type:"text",  text:`You are an Australian bookkeeping assistant. Analyse this receipt or invoice image and extract expense details. Reply ONLY with valid JSON — no explanation, no markdown. Format:\n{"description":"...","amount":0.00,"date":"YYYY-MM-DD","category":"${CATS.join("|")}","gstIncluded":true|false,"gstAmount":0.00,"vendor":"...","note":"one sentence about this expense and why you categorised it this way"}` }
          ];

      const resp = await fetch("/api/scan", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ messages:[{ role:"user", content }] })
      });

      const data = await resp.json();
      const text = data.content?.find(b=>b.type==="text")?.text || "";

      let parsed;
      try { parsed = JSON.parse(text.replace(/```json|```/g,"").trim()); }
      catch { throw new Error("Could not read document. Try a clearer image."); }

      setAiResult(parsed);
      setAiNote(parsed.note || "");
      setForm({
        date:     parsed.date || today(),
        category: CATS.includes(parsed.category) ? parsed.category : "Other",
        desc:     parsed.description || parsed.vendor || "",
        amount:   String(parsed.amount || ""),
        gstIncluded: parsed.gstIncluded !== false,
      });
    } catch(e) {
      setError(e.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const onDrop = useCallback(e => {
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f) processFile(f);
  }, [processFile]);

  const handleConfirm = () => {
    if (!form?.desc || !form?.amount) return;
    onConfirm({ ...form, amount: parseFloat(form.amount) });
  };

  if (loading) return (
    <div className="card" style={{textAlign:"center",padding:"48px 24px"}}>
      <div style={{fontSize:"40px",marginBottom:"14px"}} className="pulse">🔍</div>
      <div style={{fontFamily:"var(--ff)",fontSize:"17px",fontWeight:700,marginBottom:"6px"}}>Reading document…</div>
      <div style={{color:"var(--muted)",fontSize:"13px"}}>AI is extracting details and suggesting allocation</div>
    </div>
  );

  if (aiResult && form) return (
    <div className="ai-result">
      <div className="ai-header">
        <span className="ai-badge">✦ AI SCANNED</span>
        <span className="ai-title">Confirm allocation for <em style={{color:"var(--muted)",fontStyle:"normal",fontSize:"14px",fontWeight:400}}>{fileName}</em></span>
      </div>

      {aiNote && <div className="ai-note">💡 {aiNote}</div>}

      <div style={{marginTop:"16px"}} className="fstack">
        <div className="frow">
          <div className="field">
            <label>Description</label>
            <input value={form.desc} onChange={e=>setForm(f=>({...f,desc:e.target.value}))} />
          </div>
          <div className="field">
            <label>Amount (AUD incl. GST)</label>
            <input type="number" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))} inputMode="decimal" />
          </div>
        </div>
        <div className="frow">
          <div className="field">
            <label>Date</label>
            <input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} />
          </div>
          <div className="field">
            <label>Category</label>
            <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
              {CATS.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="field">
          <label>GST Treatment</label>
          <select value={form.gstIncluded?"yes":"no"} onChange={e=>setForm(f=>({...f,gstIncluded:e.target.value==="yes"}))}>
            <option value="yes">GST Included (1/11th ITC claim)</option>
            <option value="no">No GST / GST-exempt</option>
          </select>
        </div>
        {form.gstIncluded && form.amount && (
          <div style={{background:"var(--brand-dim)",borderRadius:"7px",padding:"10px 13px",fontSize:"12.5px",color:"var(--brand)",display:"flex",justifyContent:"space-between"}}>
            <span>Estimated ITC claim</span>
            <strong>{fmt(parseFloat(form.amount)/11)}</strong>
          </div>
        )}
      </div>

      <div style={{display:"flex",gap:"10px",marginTop:"18px",flexWrap:"wrap"}}>
        <button className="btn btn-p" onClick={handleConfirm}>{Ic.check} Confirm & Save Expense</button>
        <button className="btn btn-g" onClick={()=>{setAiResult(null);setForm(null);setFileName("");}}>
          {Ic.upload} Scan Another
        </button>
        <button className="btn btn-g" style={{marginLeft:"auto"}} onClick={onCancel}>{Ic.close} Cancel</button>
      </div>
    </div>
  );

  return (
    <div>
      {error && <div className="auth-err" style={{marginBottom:"14px"}}>{error}</div>}
      <div
        className={`drop-zone ${drag?"drag":""}`}
        onClick={()=>fileRef.current?.click()}
        onDragOver={e=>{e.preventDefault();setDrag(true)}}
        onDragLeave={()=>setDrag(false)}
        onDrop={onDrop}
      >
        <div className="drop-icon">📄</div>
        <div className="drop-title">Drop a receipt or invoice here</div>
        <div className="drop-sub">or <span style={{color:"var(--brand)",fontWeight:600}}>click to browse</span></div>
        <div className="drop-types">Supports JPG · PNG · WEBP · PDF</div>
        <div style={{marginTop:"14px",display:"flex",alignItems:"center",gap:"8px",justifyContent:"center",fontSize:"12px",color:"var(--muted)"}}>
          {Ic.spark}<span style={{color:"var(--brand)",fontWeight:600}}>AI</span> reads the document and suggests category, amount & GST
        </div>
      </div>
      <input ref={fileRef} type="file" accept="image/*,application/pdf" style={{display:"none"}}
        onChange={e=>processFile(e.target.files[0])} />
    </div>
  );
}

/* ─── Elephant Mascot ────────────────────────────────────────────────────── */
const Elephant = ({size=38}) => {
  const s = size;
  const r = s / 200;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 210" width={s} height={s*1.05} style={{flexShrink:0}}>
      {/* Shadow */}
      <ellipse cx="100" cy="202" rx="55" ry="7" fill="#3a6a94" opacity="0.15"/>
      {/* Back legs */}
      <rect x="68" y="158" width="24" height="38" rx="12" fill="#3a6a94"/>
      <rect x="108" y="158" width="24" height="38" rx="12" fill="#3a6a94"/>
      {/* Body */}
      <ellipse cx="100" cy="158" rx="55" ry="46" fill="#5b8db8"/>
      <ellipse cx="100" cy="162" rx="34" ry="29" fill="#89b8d9" opacity="0.35"/>
      {/* Tail */}
      <path d="M153 138 Q166 124 163 112 Q161 105 166 99" fill="none" stroke="#3a6a94" strokeWidth="3.5" strokeLinecap="round"/>
      <circle cx="166" cy="97" r="4" fill="#3a6a94"/>
      {/* Ears */}
      <ellipse cx="56" cy="98" rx="28" ry="36" fill="#3a6a94"/>
      <ellipse cx="60" cy="100" rx="18" ry="25" fill="#a8cfe8"/>
      <ellipse cx="144" cy="98" rx="28" ry="36" fill="#3a6a94"/>
      <ellipse cx="140" cy="100" rx="18" ry="25" fill="#a8cfe8"/>
      {/* Head */}
      <ellipse cx="100" cy="98" rx="50" ry="49" fill="#5b8db8"/>
      <ellipse cx="90" cy="80" rx="24" ry="20" fill="#89b8d9" opacity="0.4"/>
      {/* Trunk */}
      <path d="M76 132 Q60 146 57 166 Q55 180 63 190 Q68 196 74 192 Q80 188 77 176 Q72 162 80 150 Q90 138 96 132" fill="#3a6a94" stroke="#2a5a84" strokeWidth="0.5"/>
      <ellipse cx="65" cy="192" rx="9" ry="6" fill="#5b8db8"/>
      <path d="M60 162 Q53 165 56 170" fill="none" stroke="#2a5a84" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M58 176 Q51 179 54 184" fill="none" stroke="#2a5a84" strokeWidth="1.2" strokeLinecap="round"/>
      {/* Tusks */}
      <path d="M83 132 Q72 142 68 150 Q64 158 70 162 Q76 164 80 156 Q86 144 92 133 Z" fill="#f0e8d0" stroke="#d4c9a8" strokeWidth="0.8"/>
      <path d="M116 132 Q128 142 132 150 Q136 158 130 162 Q124 164 120 156 Q114 144 108 133 Z" fill="#f0e8d0" stroke="#d4c9a8" strokeWidth="0.8"/>
      {/* Front legs */}
      <rect x="76" y="186" width="24" height="18" rx="12" fill="#3a6a94"/>
      <rect x="100" y="186" width="24" height="18" rx="12" fill="#3a6a94"/>
      {/* Eyes */}
      <ellipse cx="85" cy="88" rx="12" ry="13" fill="#f5f5f0"/>
      <ellipse cx="115" cy="88" rx="12" ry="13" fill="#f5f5f0"/>
      <ellipse cx="87" cy="89" rx="8" ry="9" fill="#1a3a5c"/>
      <ellipse cx="117" cy="89" rx="8" ry="9" fill="#1a3a5c"/>
      <ellipse cx="88" cy="90" rx="5" ry="5.5" fill="#0a1520"/>
      <ellipse cx="118" cy="90" rx="5" ry="5.5" fill="#0a1520"/>
      <circle cx="91" cy="86" r="2.5" fill="white"/>
      <circle cx="121" cy="86" r="2.5" fill="white"/>
      {/* Glasses lens */}
      <rect x="74" y="80" width="24" height="17" rx="6" fill="#c8e8ff" opacity="0.28"/>
      <rect x="102" y="80" width="24" height="17" rx="6" fill="#c8e8ff" opacity="0.28"/>
      {/* Glasses frames */}
      <rect x="74" y="80" width="24" height="17" rx="6" fill="none" stroke="#1a2840" strokeWidth="1.8"/>
      <rect x="102" y="80" width="24" height="17" rx="6" fill="none" stroke="#1a2840" strokeWidth="1.8"/>
      <line x1="98" y1="88" x2="102" y2="88" stroke="#1a2840" strokeWidth="1.8"/>
      <path d="M74 88 Q62 88 55 84" fill="none" stroke="#1a2840" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M126 88 Q138 88 145 84" fill="none" stroke="#1a2840" strokeWidth="1.8" strokeLinecap="round"/>
      {/* Blush */}
      <ellipse cx="72" cy="106" rx="10" ry="6" fill="#e87070" opacity="0.3"/>
      <ellipse cx="128" cy="106" rx="10" ry="6" fill="#e87070" opacity="0.3"/>
      {/* Smile */}
      <path d="M88 116 Q100 126 112 116" fill="none" stroke="#1a3a5c" strokeWidth="1.8" strokeLinecap="round"/>
      {/* Eyebrows */}
      <path d="M75 74 Q85 68 97 72" fill="none" stroke="#1a3a5c" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M103 72 Q115 68 125 74" fill="none" stroke="#1a3a5c" strokeWidth="1.8" strokeLinecap="round"/>
      {/* Bowtie */}
      <path d="M88 148 L100 154 L112 148 L100 152 Z" fill="#1a3050"/>
      <path d="M88 160 L100 154 L112 160 L100 156 Z" fill="#1a3050"/>
      <ellipse cx="100" cy="154" rx="5" ry="5" fill="#2a5080"/>
    </svg>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   AI CHATBOT — Bookie (powered by Claude)
═══════════════════════════════════════════════════════════════════════════ */
const SUGGESTIONS = [
  "How do I add an invoice?",
  "How does GST work?",
  "What is BAS?",
  "How do I scan a receipt?",
  "What is HECS?",
  "How do I add an accountant?",
  "What is PAYG withholding?",
  "How do I mark an invoice as paid?",
];

const SYSTEM_PROMPT = `You are Bookie, the friendly AI assistant for The Busy Bookie — an Australian bookkeeping app for small businesses. You have an elephant mascot with glasses.

You help Australian small business owners navigate the app and understand their bookkeeping, GST, BAS, tax obligations, invoicing, and expenses.

The app has these sections:
- Dashboard: Overview of revenue, outstanding invoices, GST, and expenses
- Invoices: Create ATO-compliant tax invoices, scan existing invoices with AI, filter by status, mark as paid
- Expenses: Track expenses with GST, scan receipts with AI, filter by category/status
- GST Tracker: See GST collected vs input tax credits (ITCs)
- BAS Forecast: Quarterly BAS estimates across all 4 AU financial year quarters
- PAYG & Payroll: Add employees, calculate tax withheld, W1/W2 for BAS, NSW payroll tax
- Company Tax: Estimate tax liability, sole trader secondary income, HECS repayment calculator
- Tax Payments: Track and confirm ATO/Revenue NSW payment obligations
- Settings: Edit business details, manage accountant access

Australian context:
- GST is 10%, collected on most goods and services
- BAS is lodged quarterly: Q1 Jul-Sep (due 28 Oct), Q2 Oct-Dec (due 28 Feb), Q3 Jan-Mar (due 28 Apr), Q4 Apr-Jun (due 28 Jul)
- ITCs are input tax credits — GST paid on business expenses you can claim back
- PAYG withholding is tax withheld from employee wages (W1/W2 on BAS)
- NSW payroll tax applies when wages exceed $1.2M annually (5.45%)
- HECS-HELP repayments are compulsory above $54,435 taxable income
- ABN is Australian Business Number (11 digits)

Keep responses concise, friendly, and practical. Use Australian spelling. If asked something outside bookkeeping or the app, politely redirect. Never give specific legal or financial advice — recommend consulting a registered tax agent for complex matters. Always be encouraging and warm.`;

function Chatbot({ user }) {
  const [open, setOpen]       = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "G'day! I'm Bookie 🐘 Your Busy Bookie assistant. I can help you navigate the app, understand GST and BAS, and answer any bookkeeping questions. What can I help you with today?" }
  ]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const endRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    if (open) {
      setHasUnread(false);
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, [open, messages]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");
    setMessages(m => [...m, { role: "user", text: msg }]);
    setLoading(true);

    try {
      const history = messages
        .filter(m => m.role !== "bot" || messages.indexOf(m) > 0)
        .map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text }));

      const resp = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: SYSTEM_PROMPT,
          messages: [...history, { role: "user", content: msg }]
        })
      });
      const data = await resp.json();
      const reply = data.content?.[0]?.text || "Sorry, I couldn't get a response. Please try again.";
      setMessages(m => [...m, { role: "bot", text: reply }]);
    } catch {
      setMessages(m => [...m, { role: "bot", text: "Sorry, something went wrong. Please try again in a moment." }]);
    }
    setLoading(false);
  };

  const shownSugs = messages.length <= 2;

  return (
    <>
      {/* Chat window */}
      {open && (
        <div className="chat-window">
          <div className="chat-header">
            <Elephant size={34}/>
            <div className="chat-header-text">
              <div className="chat-header-name">Bookie</div>
              <div className="chat-header-status">● Online — ask me anything</div>
            </div>
            <button onClick={() => setOpen(false)}
              style={{ background: "none", border: "none", color: "rgba(255,255,255,.6)", cursor: "pointer", fontSize: "18px", lineHeight: 1 }}>
              ✕
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.role}`}>
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="chat-msg bot">
                <div className="chat-typing">
                  <span/><span/><span/>
                </div>
              </div>
            )}
            <div ref={endRef}/>
          </div>

          {shownSugs && (
            <div className="chat-suggestions">
              {SUGGESTIONS.slice(0, 4).map(s => (
                <button key={s} className="chat-sug" onClick={() => send(s)}>{s}</button>
              ))}
            </div>
          )}

          <div className="chat-input-row">
            <input
              ref={inputRef}
              className="chat-input"
              placeholder="Ask Bookie anything..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
            />
            <button className="chat-send" onClick={() => send()}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9 22,2"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button className="chat-fab" onClick={() => setOpen(o => !o)} title="Chat with Bookie">
        <div className="chat-fab-inner">
          <Elephant size={38}/>
          {hasUnread && !open && <div className="chat-unread">1</div>}
        </div>
      </button>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════════════════════════════════════ */
function Dashboard({ invoices, expenses }) {
  const rev  = invoices.filter(i=>i.status==="paid").reduce((a,i)=>a+ci(i).s,0);
  const out  = invoices.filter(i=>i.status!=="paid"&&i.status!=="draft").reduce((a,i)=>a+ci(i).t,0);
  const gc   = invoices.filter(i=>i.status==="paid").reduce((a,i)=>a+ci(i).g,0);
  const itc  = expenses.filter(e=>e.gstIncluded).reduce((a,e)=>a+e.amount/11,0);
  const net  = gc - itc;
  const totE = expenses.reduce((a,e)=>a+e.amount,0);
  const recent = [...invoices].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,4);

  // HECS from localStorage
  const hecsEnabled = localStorage.getItem("bb_hecs_enabled")==="true";
  const hecsRate = (income) => {
    if (income < 54435)  return 0;
    if (income < 62850)  return 0.010;
    if (income < 66621)  return 0.020;
    if (income < 70619)  return 0.025;
    if (income < 74856)  return 0.030;
    if (income < 79347)  return 0.035;
    if (income < 84108)  return 0.040;
    if (income < 89155)  return 0.045;
    if (income < 94504)  return 0.050;
    if (income < 100175) return 0.055;
    return 0.060 + Math.min(0.04, Math.floor((income-100175)/10000)*0.005);
  };
  const hecsRepayment = hecsEnabled ? rev * hecsRate(rev) : 0;
  const hecsMonthly   = hecsRepayment / 12;

  return (
    <div>
      <div className="ph">
        <div>
          <div className="ph-title">Overview</div>
          <div className="ph-sub">{new Date().toLocaleDateString("en-AU",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</div>
        </div>
      </div>

      <div className="g4">
        {[
          {l:"Revenue (Paid)", v:fmt(rev),  s:"Excl. GST",      c:"g"},
          {l:"Outstanding",   v:fmt(out),  s:"Incl. GST",      c:"b"},
          {l:"Net GST",       v:fmt(net),  s:"Payable to ATO", c:net>0?"r":"g"},
          {l:"Expenses",      v:fmt(totE), s:"Incl. GST",      c:""},
        ].map(x=>(
          <div key={x.l} className="card card-xs">
            <div className="sl">{x.l}</div>
            <div className={`sv ${x.c}`}>{x.v}</div>
            <div className="ss">{x.s}</div>
          </div>
        ))}
        {hecsEnabled && (
          <div className="card card-xs" style={{borderColor:"rgba(212,98,31,.2)",background:"rgba(212,98,31,.04)"}}>
            <div className="sl">HECS Repayment</div>
            <div className="sv" style={{color:"var(--orange)"}}>{fmt(hecsRepayment)}</div>
            <div className="ss">{fmt(hecsMonthly)}/mo est. · Set aside</div>
          </div>
        )}
      </div>

      <div className="g2">
        <div className="card">
          <div className="sh2"><div className="sh2-title">Recent Invoices</div></div>
          <div className="tscroll">
            <table>
              <thead><tr><th>#</th><th>Client</th><th>Total</th><th>Status</th></tr></thead>
              <tbody>
                {recent.map(inv=>{
                  const c=ci(inv);
                  return (
                    <tr key={inv.id}>
                      <td style={{color:"var(--muted)",fontSize:"11.5px"}}>{inv.number}</td>
                      <td style={{fontWeight:500}}>{inv.client}</td>
                      <td className="tmono">{fmt(c.t)}</td>
                      <td><SBadge s={inv.status}/></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="sh2"><div className="sh2-title">GST Summary</div></div>
          <div style={{display:"flex",flexDirection:"column",gap:"13px"}}>
            {[
              {l:"GST Collected (1A)", v:gc,  p:100,                                    col:"var(--green)"},
              {l:"Input Tax Credits (1B)",v:itc,p:Math.min(100,(itc/Math.max(gc,1))*100),col:"var(--blue)"},
            ].map(r=>(
              <div key={r.l}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:"12.5px",marginBottom:"4px"}}>
                  <span style={{color:"var(--muted)"}}>{r.l}</span>
                  <span style={{color:r.col,fontWeight:600}}>{fmt(r.v)}</span>
                </div>
                <div className="prog-track"><div className="prog-fill" style={{width:`${r.p}%`,background:r.col}}/></div>
              </div>
            ))}
            <div className="hr" style={{margin:"4px 0"}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontWeight:600,fontSize:"13px"}}>Net GST Payable</span>
              <span style={{fontFamily:"var(--ff)",fontSize:"20px",fontWeight:700,color:net>0?"var(--red)":"var(--green)"}}>{fmt(net)}</span>
            </div>
            <div style={{background:"var(--brand-dim)",borderRadius:"7px",padding:"10px 13px",fontSize:"12px",color:"var(--brand)",lineHeight:1.7}}>
              💡 Next BAS due: <strong>{(() => {
                const m = new Date().getMonth();
                const y = new Date().getFullYear();
                if (m >= 6 && m <= 8)  return `28 October ${y}`;
                if (m >= 9 && m <= 11) return `28 February ${y+1}`;
                if (m >= 0 && m <= 2)  return `28 April ${y}`;
                return `28 July ${y}`;
              })()}</strong> · {(() => {
                const m = new Date().getMonth();
                const y = new Date().getFullYear();
                const fy = m >= 6 ? y : y-1;
                if (m >= 6 && m <= 8)  return `Q1 FY${String(fy+1).slice(2)}`;
                if (m >= 9 && m <= 11) return `Q2 FY${String(fy+1).slice(2)}`;
                if (m >= 0 && m <= 2)  return `Q3 FY${String(fy+1).slice(2)}`;
                return `Q4 FY${String(fy+1).slice(2)}`;
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   INVOICES
══════════════════════════════════════════════════════════════════════════ */
const eInv = () => ({client:"",abn:"",address:"",date:today(),due:addD(today(),30),items:[{desc:"",qty:1,unit:0,gst:true}],status:"draft",notes:""});

function Invoices({ invoices, setInvoices, biz, abn, onSave, onDelete, onPaid }) {
  const [view,setView]         = useState("list");
  const [form,setForm]         = useState(eInv());
  const [prev,setPrev]         = useState(null);
  const [showScan,setShowScan] = useState(false);
  const [filter,setFilter]     = useState("all");
  const [editStatus,setEditStatus] = useState(null); // {id, current}

  const changeStatus = async (id, newStatus) => {
    await supabase.from("invoices").update({status:newStatus}).eq("id",id);
    setInvoices(p=>p.map(i=>i.id===id?{...i,status:newStatus}:i));
    setEditStatus(null);
  };

  const STATUSES = ["draft","sent","paid","overdue"];
  const filtered = filter==="all" ? invoices : invoices.filter(i=>i.status===filter);

  const nextN = () => `INV-${String(Math.max(0,...invoices.map(i=>parseInt(i.number.replace(/\D/g,""))||0))+1).padStart(3,"0")}`;
  const save  = async st => {
    const draft = {...form, number:nextN(), status:st};
    const saved = await onSave(draft);
    setInvoices(p=>[...p, saved]);
    setView("list"); setForm(eInv());
  };
  const upI   = (idx,f,v) => setForm(fm=>{const it=[...fm.items];it[idx]={...it[idx],[f]:(f==="qty"||f==="unit")?parseFloat(v)||0:f==="gst"?v:v};return{...fm,items:it};});
  const {s,g,t} = ci(form);

  /* Invoice preview */
  if (view==="preview" && prev) {
    const c=ci(prev);
    return (
      <div>
        <div style={{display:"flex",gap:"9px",marginBottom:"18px",flexWrap:"wrap"}}>
          <button className="btn btn-g" onClick={()=>setView("list")}>{Ic.back} Back</button>
          <button className="btn btn-p">{Ic.dl} Print / Export</button>
        </div>
        <div className="inv-wrap">
          <div className="inv-hd">
            <div>
              <div className="inv-co">The Busy Bookie</div>
              <div className="inv-tag">Your Bookie, Your Business</div>
              <div style={{fontSize:"11.5px",color:"#888",marginTop:"6px"}}>On behalf of: <strong>{biz}</strong></div>
              <div style={{fontSize:"11.5px",color:"#888"}}>{abnDisplay}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div className="inv-lbl">TAX INVOICE</div>
              <div className="inv-meta">{prev.number}</div>
              <div className="inv-meta">Date: {fmtD(prev.date)}</div>
              <div className="inv-meta">Due: {fmtD(prev.due)}</div>
            </div>
          </div>
          <div style={{marginBottom:"18px"}}>
            <div style={{fontSize:"10.5px",color:"#888",textTransform:"uppercase",letterSpacing:".8px",marginBottom:"3px"}}>Bill To</div>
            <div style={{fontWeight:700,fontSize:"14px"}}>{prev.client}</div>
            {prev.abn && <div style={{fontSize:"11.5px",color:"#666"}}>ABN {prev.abn}</div>}
            {prev.address && <div style={{fontSize:"11.5px",color:"#666"}}>{prev.address}</div>}
          </div>
          <div className="tscroll">
            <table style={{minWidth:"unset"}}>
              <thead><tr><th style={{width:"44%"}}>Description</th><th>Qty</th><th>Unit</th><th>GST</th><th style={{textAlign:"right"}}>Amount</th></tr></thead>
              <tbody>
                {prev.items.map((it,i)=>(
                  <tr key={i}>
                    <td>{it.desc}</td><td>{it.qty}</td><td>{fmt(it.unit)}</td>
                    <td>{it.gst?"10%":"—"}</td>
                    <td style={{textAlign:"right"}}>{fmt(it.qty*it.unit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{maxWidth:"250px",marginLeft:"auto",marginTop:"14px"}}>
            <div className="inv-tr"><span>Subtotal</span><span>{fmt(c.s)}</span></div>
            <div className="inv-tr"><span>GST (10%)</span><span>{fmt(c.g)}</span></div>
            <div className="inv-tr fin"><span>Total AUD</span><span>{fmt(c.t)}</span></div>
          </div>
          {prev.notes && <div style={{marginTop:"14px",fontSize:"11.5px",color:"#555",background:"#f9f8f6",padding:"11px",borderRadius:"6px"}}><strong>Notes:</strong> {prev.notes}</div>}
          <div className="inv-ft">Payment due {fmtD(prev.due)}. Valid tax invoice for GST purposes. ABN {abn}. busybookie.com.au</div>
        </div>
      </div>
    );
  }

  /* New invoice form */
  if (view==="new") return (
    <div>
      <div style={{marginBottom:"16px"}}><button className="btn btn-g" onClick={()=>setView("list")}>{Ic.back} Cancel</button></div>
      <div style={{display:"grid",gridTemplateColumns:"minmax(0,1fr) 300px",gap:"18px",alignItems:"start"}}>
        <div className="card">
          <div className="sh2-title" style={{marginBottom:"16px"}}>New Invoice</div>
          <div className="fstack">
            <div className="frow">
              <div className="field"><label>Client Name</label><input value={form.client} onChange={e=>setForm(f=>({...f,client:e.target.value}))} placeholder="Acme Corp Pty Ltd"/></div>
              <div className="field"><label>Client ABN</label><input value={form.abn} onChange={e=>setForm(f=>({...f,abn:e.target.value}))} placeholder="51 824 753 556" inputMode="numeric"/></div>
            </div>
            <div className="field"><label>Client Address</label><input value={form.address} onChange={e=>setForm(f=>({...f,address:e.target.value}))} placeholder="123 Collins St, Melbourne VIC 3000"/></div>
            <div className="frow">
              <div className="field"><label>Invoice Date</label><input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))}/></div>
              <div className="field"><label>Due Date</label><input type="date" value={form.due} onChange={e=>setForm(f=>({...f,due:e.target.value}))}/></div>
            </div>
            <div className="hr"/>
            <div className="sh2">
              <span style={{fontWeight:600,fontSize:"13px"}}>Line Items</span>
              <button className="btn btn-g btn-sm" onClick={()=>setForm(f=>({...f,items:[...f.items,{desc:"",qty:1,unit:0,gst:true}]}))}>{Ic.plus} Add Row</button>
            </div>
            {form.items.map((it,idx)=>(
              <div key={idx} className="line-items-grid" style={{display:"grid",gridTemplateColumns:"1fr 58px 110px 70px 34px",gap:"7px",alignItems:"end"}}>
                <div className="field"><label style={{visibility:idx===0?"visible":"hidden"}}>Description</label><input value={it.desc} onChange={e=>upI(idx,"desc",e.target.value)} placeholder="Service…"/></div>
                <div className="field"><label style={{visibility:idx===0?"visible":"hidden"}}>Qty</label><input type="number" value={it.qty} onChange={e=>upI(idx,"qty",e.target.value)}/></div>
                <div className="field"><label style={{visibility:idx===0?"visible":"hidden"}}>Unit $</label><input type="number" value={it.unit} onChange={e=>upI(idx,"unit",e.target.value)}/></div>
                <div className="field"><label style={{visibility:idx===0?"visible":"hidden"}}>GST</label>
                  <select value={it.gst?"yes":"no"} onChange={e=>upI(idx,"gst",e.target.value==="yes")}><option value="yes">10%</option><option value="no">Nil</option></select>
                </div>
                <div style={{paddingBottom:"1px"}}>
                  {form.items.length>1 && <button className="btn btn-d btn-sm" style={{padding:"9px"}} onClick={()=>setForm(f=>({...f,items:f.items.filter((_,i)=>i!==idx)}))}>{Ic.trash}</button>}
                </div>
              </div>
            ))}
            <div className="hr"/>
            <div className="field"><label>Notes / Payment Details</label><textarea value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} placeholder="BSB: 062-000  Acc: 12345678  Bank: CBA"/></div>
          </div>
        </div>
        {/* Summary */}
        <div style={{display:"flex",flexDirection:"column",gap:"11px"}}>
          <div className="card">
            <div className="sh2-title" style={{marginBottom:"13px"}}>Summary</div>
            <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:"13px"}}><span style={{color:"var(--muted)"}}>Subtotal</span><span>{fmt(s)}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:"13px"}}><span style={{color:"var(--muted)"}}>GST (10%)</span><span style={{color:"var(--brand)"}}>{fmt(g)}</span></div>
              <div className="hr" style={{margin:"4px 0"}}/>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontWeight:700}}>Total AUD</span>
                <span style={{fontFamily:"var(--ff)",fontSize:"21px",fontWeight:700}}>{fmt(t)}</span>
              </div>
            </div>
          </div>
          <button className="btn btn-p btn-blk" onClick={()=>save("sent")}>{Ic.check} Save & Mark Sent</button>
          <button className="btn btn-g btn-blk" onClick={()=>save("draft")}>Save as Draft</button>
        </div>
      </div>
    </div>
  );

  const handleScanConfirm = async (scanned) => {
    const nextN = () => `INV-${String(Math.max(0,...invoices.map(i=>parseInt((i.number||"").replace(/\D/g,""))||0))+1).padStart(3,"0")}`;
    const inv = { ...scanned, number: scanned.number || nextN() };
    const saved = await onSave(inv);
    setInvoices(p=>[...p, saved]);
    setShowScan(false);
  };

  /* Invoice list */
  return (
    <div>
      <div className="ph">
        <div><div className="ph-title">Invoices</div><div className="ph-sub">ATO-compliant tax invoices</div></div>
        <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
          <button className="btn btn-p" onClick={()=>{setShowScan(s=>!s);setView("list");}}>
            {Ic.upload} Scan Invoice (AI)
          </button>
          <button className="btn btn-g" onClick={()=>{setView("new");setShowScan(false);}}>
            {Ic.plus} New Invoice
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div style={{display:"flex",gap:"8px",marginBottom:"16px",flexWrap:"wrap",alignItems:"center"}}>
        <span style={{fontSize:"12px",color:"var(--muted)",fontWeight:600}}>Filter:</span>
        {["all","draft","sent","paid","overdue"].map(s=>(
          <button key={s} className={`btn btn-sm ${filter===s?"btn-p":"btn-g"}`}
            style={{minHeight:"32px",padding:"4px 12px",fontSize:"12px",textTransform:"capitalize"}}
            onClick={()=>setFilter(s)}>
            {s==="all"?`All (${invoices.length})`:
              `${s.charAt(0).toUpperCase()+s.slice(1)} (${invoices.filter(i=>i.status===s).length})`}
          </button>
        ))}
      </div>

      {showScan && (
        <div style={{marginBottom:"18px"}}>
          <AIInvoiceScanner onConfirm={handleScanConfirm} onCancel={()=>setShowScan(false)}/>
        </div>
      )}

      {/* Status edit modal */}
      {editStatus && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}} onClick={()=>setEditStatus(null)}>
          <div className="card" style={{maxWidth:"320px",width:"100%"}} onClick={e=>e.stopPropagation()}>
            <div className="sh2-title" style={{marginBottom:"14px"}}>Change Invoice Status</div>
            <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
              {STATUSES.map(s=>(
                <button key={s} className={`btn ${editStatus.current===s?"btn-p":"btn-g"}`}
                  style={{justifyContent:"flex-start",textTransform:"capitalize"}}
                  onClick={()=>changeStatus(editStatus.id,s)}>
                  {s==="paid"?"✓ Paid":s==="sent"?"📤 Sent":s==="overdue"?"⚠️ Overdue":"📝 Draft"}
                </button>
              ))}
            </div>
            <button className="btn btn-g btn-blk" style={{marginTop:"12px"}} onClick={()=>setEditStatus(null)}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{display:"flex",flexDirection:"column",gap:"9px"}}>
        {filtered.length===0 && (
          <div className="card" style={{textAlign:"center",padding:"32px",color:"var(--muted)"}}>
            No {filter==="all"?"invoices":filter+" invoices"} found.
          </div>
        )}
        {filtered.map(inv=>{
          const c=ci(inv);
          return (
            <div key={inv.id} className="icard">
              <div className="icard-top">
                <div>
                  <div className="icard-name">{inv.client}</div>
                  <div className="icard-sub">{inv.number} · {fmtD(inv.date)} · Due {fmtD(inv.due)}</div>
                </div>
                {/* Clickable status badge */}
                <button style={{background:"none",border:"none",cursor:"pointer",padding:0}}
                  onClick={()=>setEditStatus({id:inv.id,current:inv.status})}
                  title="Click to change status">
                  <SBadge s={inv.status}/>
                  <span style={{fontSize:"9px",color:"var(--dim)",display:"block",textAlign:"center",marginTop:"2px"}}>edit</span>
                </button>
              </div>
              <div className="icard-bot">
                <div>
                  <div className="icard-amt">{fmt(c.t)}</div>
                  <div className="icard-gst">Incl. {fmt(c.g)} GST</div>
                </div>
                <div style={{display:"flex",gap:"7px",flexWrap:"wrap"}}>
                  <button className="btn btn-g btn-sm" onClick={()=>{setPrev(inv);setView("preview");}}>{Ic.eye}</button>
                  {inv.status!=="paid" && <button className="btn btn-sm" style={{background:"rgba(26,122,73,.1)",color:"var(--green)",border:"1px solid rgba(26,122,73,.2)"}} onClick={()=>onPaid(inv.id)}>{Ic.check} Paid</button>}
                  <button className="btn btn-d btn-sm" onClick={()=>onDelete(inv.id)}>{Ic.trash}</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   AI INVOICE SCANNER
══════════════════════════════════════════════════════════════════════════ */
function AIInvoiceScanner({ onConfirm, onCancel }) {
  const [drag,setDrag]         = useState(false);
  const [loading,setLoading]   = useState(false);
  const [aiResult,setAiResult] = useState(null);
  const [aiNote,setAiNote]     = useState("");
  const [error,setError]       = useState("");
  const [form,setForm]         = useState(null);
  const [fileName,setFileName] = useState("");
  const fileRef = useRef();

  const processFile = useCallback(async (file) => {
    if (!file) return;
    const allowed = ["image/jpeg","image/png","image/webp","image/gif","application/pdf"];
    if (!allowed.includes(file.type)) { setError("Please upload an image (JPG, PNG, WEBP) or PDF."); return; }
    setError(""); setLoading(true); setAiResult(null); setFileName(file.name);
    try {
      const b64 = await fileToBase64(file);
      const isPDF = file.type === "application/pdf";
      const prompt = `You are an Australian bookkeeping assistant. Analyse this invoice document and extract all details. Reply ONLY with valid JSON — no explanation, no markdown. Format:
{"client":"company or person name","clientAbn":"ABN if visible or empty string","date":"YYYY-MM-DD","due":"YYYY-MM-DD","invoiceNumber":"invoice number or empty string","items":[{"desc":"description","qty":1,"unit":0.00,"gst":true}],"totalAmount":0.00,"gstAmount":0.00,"status":"sent","notes":"","note":"one sentence summarising what this invoice is for"}`;
      const content = isPDF
        ? [{ type:"document", source:{ type:"base64", media_type:"application/pdf", data:b64 } }, { type:"text", text:prompt }]
        : [{ type:"image", source:{ type:"base64", media_type:file.type, data:b64 } }, { type:"text", text:prompt }];
      const resp = await fetch("/api/scan", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ messages:[{ role:"user", content }] })
      });
      const data = await resp.json();
      const text = data.content?.find(b=>b.type==="text")?.text || "";
      let parsed;
      try { parsed = JSON.parse(text.replace(/```json|```/g,"").trim()); }
      catch { throw new Error("Could not read document. Try a clearer image."); }
      setAiResult(parsed);
      setAiNote(parsed.note || "");
      setForm({
        client: parsed.client || "",
        abn: parsed.clientAbn || "",
        address: "",
        date: parsed.date || today(),
        due: parsed.due || addD(today(), 30),
        items: parsed.items?.length ? parsed.items.map(i=>({desc:i.desc||"",qty:Number(i.qty)||1,unit:Number(i.unit)||0,gst:i.gst!==false})) : [{desc:"",qty:1,unit:0,gst:true}],
        status: "sent",
        notes: parsed.notes || "",
        number: parsed.invoiceNumber || "",
      });
    } catch(e) {
      setError(e.message || "Something went wrong. Please try again.");
    } finally { setLoading(false); }
  }, []);

  const onDrop = useCallback(e => { e.preventDefault(); setDrag(false); const f=e.dataTransfer.files[0]; if(f)processFile(f); }, [processFile]);

  const upItem = (idx,f,v) => setForm(fm=>{const it=[...fm.items];it[idx]={...it[idx],[f]:(f==="qty"||f==="unit")?parseFloat(v)||0:f==="gst"?v:v};return{...fm,items:it};});
  const {s,g,t} = ci(form||{items:[]});

  if (loading) return (
    <div className="card" style={{textAlign:"center",padding:"48px 24px"}}>
      <div style={{fontSize:"40px",marginBottom:"14px"}} className="pulse">🔍</div>
      <div style={{fontFamily:"var(--ff)",fontSize:"17px",fontWeight:700,marginBottom:"6px"}}>Reading invoice…</div>
      <div style={{color:"var(--muted)",fontSize:"13px"}}>AI is extracting client, amounts and line items</div>
    </div>
  );

  if (aiResult && form) return (
    <div className="ai-result">
      <div className="ai-header">
        <span className="ai-badge">✦ AI SCANNED</span>
        <span className="ai-title">Confirm invoice from <em style={{color:"var(--muted)",fontStyle:"normal",fontSize:"14px",fontWeight:400}}>{fileName}</em></span>
      </div>
      {aiNote && <div className="ai-note">💡 {aiNote}</div>}
      <div style={{marginTop:"16px"}} className="fstack">
        <div className="frow">
          <div className="field"><label>Client Name</label><input value={form.client} onChange={e=>setForm(f=>({...f,client:e.target.value}))}/></div>
          <div className="field"><label>Client ABN</label><input value={form.abn} onChange={e=>setForm(f=>({...f,abn:e.target.value}))} placeholder="51 824 753 556"/></div>
        </div>
        <div className="frow">
          <div className="field"><label>Invoice Date</label><input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))}/></div>
          <div className="field"><label>Due Date</label><input type="date" value={form.due} onChange={e=>setForm(f=>({...f,due:e.target.value}))}/></div>
        </div>
        <div className="frow">
          <div className="field"><label>Invoice Number</label><input value={form.number} onChange={e=>setForm(f=>({...f,number:e.target.value}))} placeholder="INV-001"/></div>
          <div className="field"><label>Status</label>
            <select value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>
              <option value="sent">Sent</option><option value="paid">Paid</option><option value="overdue">Overdue</option><option value="draft">Draft</option>
            </select>
          </div>
        </div>
        <div style={{fontWeight:600,fontSize:"13px",marginTop:"4px"}}>Line Items</div>
        {form.items.map((it,idx)=>(
          <div key={idx} style={{display:"grid",gridTemplateColumns:"1fr 60px 100px 65px",gap:"8px",alignItems:"end"}}>
            <div className="field"><label style={{visibility:idx===0?"visible":"hidden"}}>Description</label><input value={it.desc} onChange={e=>upItem(idx,"desc",e.target.value)}/></div>
            <div className="field"><label style={{visibility:idx===0?"visible":"hidden"}}>Qty</label><input type="number" value={it.qty} onChange={e=>upItem(idx,"qty",e.target.value)}/></div>
            <div className="field"><label style={{visibility:idx===0?"visible":"hidden"}}>Unit $</label><input type="number" value={it.unit} onChange={e=>upItem(idx,"unit",e.target.value)}/></div>
            <div className="field"><label style={{visibility:idx===0?"visible":"hidden"}}>GST</label>
              <select value={it.gst?"yes":"no"} onChange={e=>upItem(idx,"gst",e.target.value==="yes")}><option value="yes">10%</option><option value="no">Nil</option></select>
            </div>
          </div>
        ))}
        <div style={{background:"var(--brand-dim)",borderRadius:"7px",padding:"10px 13px",fontSize:"12.5px",color:"var(--brand)",display:"flex",justifyContent:"space-between"}}>
          <span>Total incl. GST</span><strong>{fmt(t)}</strong>
        </div>
      </div>
      <div style={{display:"flex",gap:"10px",marginTop:"16px",flexWrap:"wrap"}}>
        <button className="btn btn-p" onClick={()=>onConfirm(form)}>{Ic.check} Confirm & Save Invoice</button>
        <button className="btn btn-g" onClick={()=>{setAiResult(null);setForm(null);setFileName("");}}>
          {Ic.upload} Scan Another
        </button>
        <button className="btn btn-g" style={{marginLeft:"auto"}} onClick={onCancel}>{Ic.close} Cancel</button>
      </div>
    </div>
  );

  return (
    <div>
      {error && <div className="auth-err" style={{marginBottom:"14px"}}>{error}</div>}
      <div className={`drop-zone ${drag?"drag":""}`}
        onClick={()=>fileRef.current?.click()}
        onDragOver={e=>{e.preventDefault();setDrag(true)}}
        onDragLeave={()=>setDrag(false)}
        onDrop={onDrop}>
        <div className="drop-icon">🧾</div>
        <div className="drop-title">Drop an invoice here</div>
        <div className="drop-sub">or <span style={{color:"var(--brand)",fontWeight:600}}>click to browse</span></div>
        <div className="drop-types">Supports JPG · PNG · WEBP · PDF</div>
        <div style={{marginTop:"14px",display:"flex",alignItems:"center",gap:"8px",justifyContent:"center",fontSize:"12px",color:"var(--muted)"}}>
          {Ic.spark}<span style={{color:"var(--brand)",fontWeight:600}}>AI</span> reads the invoice and fills in all fields automatically
        </div>
      </div>
      <input ref={fileRef} type="file" accept="image/*,application/pdf" style={{display:"none"}} onChange={e=>processFile(e.target.files[0])}/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   EXPENSES (with AI Scanner)
══════════════════════════════════════════════════════════════════════════ */
function Expenses({ expenses, setExpenses, onSave, onDelete }) {
  const [showAI,setShowAI]         = useState(false);
  const [showForm,setShowForm]     = useState(false);
  const [form,setForm]             = useState({date:today(),category:"Software",desc:"",amount:"",gstIncluded:true,status:"pending"});
  const [filterCat,setFilterCat]   = useState("all");
  const [filterGST,setFilterGST]   = useState("all");
  const [filterStatus,setFilterStatus] = useState("all");
  const [editStatus,setEditStatus] = useState(null);

  const EXP_STATUSES = ["pending","paid","reconciled","reimbursed"];
  const EXP_STATUS_LABELS = {
    pending:     {label:"Pending",     color:"var(--orange)", bg:"rgba(212,98,31,.1)"},
    paid:        {label:"Paid",        color:"var(--green)",  bg:"rgba(26,122,73,.1)"},
    reconciled:  {label:"Reconciled",  color:"var(--blue)",   bg:"rgba(37,99,168,.1)"},
    reimbursed:  {label:"Reimbursed",  color:"var(--muted)",  bg:"var(--surface2)"},
  };

  const ExpBadge = ({s}) => {
    const st = EXP_STATUS_LABELS[s] || EXP_STATUS_LABELS.pending;
    return <span className="badge" style={{background:st.bg,color:st.color}}>{st.label}</span>;
  };

  const changeExpStatus = async (id, newStatus) => {
    await supabase.from("expenses").update({status:newStatus}).eq("id",id);
    setExpenses(p=>p.map(e=>e.id===id?{...e,status:newStatus}:e));
    setEditStatus(null);
  };

  const addExp = async (data) => {
    const saved = await onSave({...data, status: data.status||"pending"});
    setExpenses(p=>[...p, saved]);
    setShowAI(false); setShowForm(false);
  };
  const addManual = () => {
    if (!form.desc||!form.amount) return;
    addExp({...form,amount:parseFloat(form.amount)});
    setForm({date:today(),category:"Software",desc:"",amount:"",gstIncluded:true,status:"pending"});
  };

  const filtered = expenses
    .filter(e => filterCat==="all" || e.category===filterCat)
    .filter(e => filterGST==="all" || (filterGST==="gst" ? e.gstIncluded : !e.gstIncluded))
    .filter(e => filterStatus==="all" || (e.status||"pending")===filterStatus);

  const total  = filtered.reduce((a,e)=>a+e.amount,0);
  const totGST = filtered.filter(e=>e.gstIncluded).reduce((a,e)=>a+e.amount/11,0);
  const allCats = [...new Set(expenses.map(e=>e.category))].sort();

  return (
    <div>
      <div className="ph">
        <div><div className="ph-title">Expenses</div><div className="ph-sub">Track expenses and input tax credits</div></div>
        <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
          <button className="btn btn-p" onClick={()=>{setShowAI(s=>!s);setShowForm(false);}}>
            {Ic.upload} Scan Receipt (AI)
          </button>
          <button className="btn btn-g" onClick={()=>{setShowForm(s=>!s);setShowAI(false);}}>
            {Ic.plus} Manual Entry
          </button>
        </div>
      </div>

      <div className="g3" style={{marginBottom:"18px"}}>
        <div className="card card-xs"><div className="sl">Total Expenses</div><div className="sv">{fmt(total)}</div><div className="ss">Incl. GST · {filtered.length} items</div></div>
        <div className="card card-xs"><div className="sl">Excl. GST</div><div className="sv">{fmt(total-totGST)}</div><div className="ss">Deductible base</div></div>
        <div className="card card-xs"><div className="sl">GST Credits (ITCs)</div><div className="sv" style={{color:"var(--blue)"}}>{fmt(totGST)}</div><div className="ss">Claimable on BAS</div></div>
      </div>

      {/* Filter bar */}
      <div style={{display:"flex",gap:"8px",marginBottom:"16px",flexWrap:"wrap",alignItems:"center"}}>
        <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}
          style={{minHeight:"34px",fontSize:"12.5px",padding:"4px 10px",background:"var(--surface)",border:"1.5px solid var(--border)",borderRadius:"7px",color:"var(--text)",fontFamily:"var(--fb)"}}>
          <option value="all">All Statuses ({expenses.length})</option>
          {EXP_STATUSES.map(s=><option key={s} value={s}>{EXP_STATUS_LABELS[s].label} ({expenses.filter(e=>(e.status||"pending")===s).length})</option>)}
        </select>
        <select value={filterCat} onChange={e=>setFilterCat(e.target.value)}
          style={{minHeight:"34px",fontSize:"12.5px",padding:"4px 10px",background:"var(--surface)",border:"1.5px solid var(--border)",borderRadius:"7px",color:"var(--text)",fontFamily:"var(--fb)"}}>
          <option value="all">All Categories</option>
          {allCats.map(c=><option key={c}>{c}</option>)}
        </select>
        <select value={filterGST} onChange={e=>setFilterGST(e.target.value)}
          style={{minHeight:"34px",fontSize:"12.5px",padding:"4px 10px",background:"var(--surface)",border:"1.5px solid var(--border)",borderRadius:"7px",color:"var(--text)",fontFamily:"var(--fb)"}}>
          <option value="all">All GST Types</option>
          <option value="gst">GST Included</option>
          <option value="nogst">No GST</option>
        </select>
        {(filterCat!=="all"||filterGST!=="all"||filterStatus!=="all") && (
          <button className="btn btn-g btn-sm" onClick={()=>{setFilterCat("all");setFilterGST("all");setFilterStatus("all");}}>Clear</button>
        )}
      </div>

      {/* AI Scanner */}
      {showAI && (
        <div style={{marginBottom:"18px"}}>
          <AIScanner onConfirm={addExp} onCancel={()=>setShowAI(false)}/>
        </div>
      )}

      {/* Manual form */}
      {showForm && (
        <div className="card" style={{marginBottom:"18px"}}>
          <div className="sh2-title" style={{marginBottom:"15px"}}>Add Expense Manually</div>
          <div className="fstack">
            <div className="frow">
              <div className="field"><label>Date</label><input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))}/></div>
              <div className="field"><label>Category</label><select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>{CATS.map(c=><option key={c}>{c}</option>)}</select></div>
            </div>
            <div className="frow">
              <div className="field"><label>Status</label>
                <select value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>
                  {EXP_STATUSES.map(s=><option key={s} value={s}>{EXP_STATUS_LABELS[s].label}</option>)}
                </select>
              </div>
              <div className="field"><label>GST</label><select value={form.gstIncluded?"yes":"no"} onChange={e=>setForm(f=>({...f,gstIncluded:e.target.value==="yes"}))}><option value="yes">GST Included (1/11th)</option><option value="no">No GST / Exempt</option></select></div>
            </div>
            <div className="frow">
              <div className="field"><label>Description</label><input value={form.desc} onChange={e=>setForm(f=>({...f,desc:e.target.value}))} placeholder="Expense description"/></div>
              <div className="field"><label>Amount (incl. GST)</label><input type="number" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))} placeholder="0.00" inputMode="decimal"/></div>
            </div>
            <div style={{display:"flex",gap:"9px",flexWrap:"wrap"}}>
              <button className="btn btn-p" onClick={addManual}>Add Expense</button>
              <button className="btn btn-g" onClick={()=>setShowForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Status change modal */}
      {editStatus && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}} onClick={()=>setEditStatus(null)}>
          <div className="card" style={{maxWidth:"300px",width:"100%"}} onClick={ev=>ev.stopPropagation()}>
            <div className="sh2-title" style={{marginBottom:"14px"}}>Change Expense Status</div>
            <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
              {EXP_STATUSES.map(s=>{
                const st=EXP_STATUS_LABELS[s];
                return (
                  <button key={s} className="btn btn-g"
                    style={{justifyContent:"flex-start",borderColor:editStatus.current===s?st.color:"var(--border)",background:editStatus.current===s?st.bg:"transparent",color:editStatus.current===s?st.color:"var(--text)"}}
                    onClick={()=>changeExpStatus(editStatus.id,s)}>
                    {s==="paid"?"✓ ":s==="reconciled"?"⚖️ ":s==="reimbursed"?"↩️ ":"⏳ "}{st.label}
                  </button>
                );
              })}
            </div>
            <button className="btn btn-g btn-blk" style={{marginTop:"12px"}} onClick={()=>setEditStatus(null)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Expense list */}
      <div style={{display:"flex",flexDirection:"column",gap:"9px"}}>
        {filtered.length===0 && (
          <div className="card" style={{textAlign:"center",padding:"32px",color:"var(--muted)"}}>
            No expenses match the current filters.
          </div>
        )}
        {[...filtered].sort((a,b)=>new Date(b.date)-new Date(a.date)).map(e=>{
          const g=e.gstIncluded?e.amount/11:0;
          const expStatus=e.status||"pending";
          const st=EXP_STATUS_LABELS[expStatus]||EXP_STATUS_LABELS.pending;
          return (
            <div key={e.id} className="icard">
              <div className="icard-top">
                <div>
                  <div className="icard-name">{e.desc}</div>
                  <div className="icard-sub">{fmtD(e.date)} · <span className="badge bg-br" style={{fontSize:"10.5px"}}>{e.category}</span></div>
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"4px"}}>
                  <button style={{background:"none",border:"none",cursor:"pointer",padding:0}}
                    onClick={()=>setEditStatus({id:e.id,current:expStatus})}
                    title="Click to change status">
                    <span className="badge" style={{background:st.bg,color:st.color}}>{st.label}</span>
                    <span style={{fontSize:"9px",color:"var(--dim)",display:"block",textAlign:"center",marginTop:"2px"}}>edit</span>
                  </button>
                  {e.gstIncluded && <span className="badge bg-b" style={{fontSize:"10px"}}>GST incl.</span>}
                </div>
              </div>
              <div className="icard-bot">
                <div>
                  <div className="icard-amt">{fmt(e.amount)}</div>
                  {e.gstIncluded && <div className="icard-gst" style={{color:"var(--blue)"}}>ITC: {fmt(g)}</div>}
                </div>
                <button className="btn btn-d btn-sm" onClick={()=>onDelete(e.id)}>{Ic.trash} Remove</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   GST TRACKER
══════════════════════════════════════════════════════════════════════════ */
function GSTTracker({ invoices, expenses }) {
  const [tab,setTab] = useState("collected");
  const allI  = invoices.filter(i=>i.status!=="draft");
  const totC  = allI.reduce((a,i)=>a+ci(i).g,0);
  const creds = expenses.filter(e=>e.gstIncluded);
  const totI  = creds.reduce((a,e)=>a+e.amount/11,0);
  const net   = totC-totI;

  return (
    <div>
      <div className="ph">
        <div><div className="ph-title">GST Tracker</div><div className="ph-sub">GST collected vs input tax credits</div></div>
      </div>
      <div className="g3" style={{marginBottom:"18px"}}>
        <div className="card card-xs"><div className="sl">GST Collected (1A)</div><div className="sv g">{fmt(totC)}</div><div className="ss">{allI.length} invoices</div></div>
        <div className="card card-xs"><div className="sl">Input Tax Credits (1B)</div><div className="sv" style={{color:"var(--blue)"}}>{fmt(totI)}</div><div className="ss">{creds.length} expenses</div></div>
        <div className="card card-xs"><div className="sl">Net GST Payable (9)</div><div className={`sv ${net>0?"r":"g"}`}>{fmt(Math.abs(net))}</div><div className="ss">{net>0?"Owed to ATO":"Refund from ATO"}</div></div>
      </div>
      <div className="card">
        <div className="tabs">
          <div className={`tab ${tab==="collected"?"on":""}`} onClick={()=>setTab("collected")}>GST Collected</div>
          <div className={`tab ${tab==="credits"?"on":""}`} onClick={()=>setTab("credits")}>Input Tax Credits</div>
        </div>
        {tab==="collected"?(
          <div className="tscroll">
            <table>
              <thead><tr><th>Date</th><th>Invoice</th><th>Client</th><th>Taxable</th><th>GST</th><th>Status</th></tr></thead>
              <tbody>
                {allI.map((inv,i)=>{const c=ci(inv);return(
                  <tr key={i}>
                    <td style={{color:"var(--muted)",fontSize:"12px"}}>{fmtD(inv.date)}</td>
                    <td style={{color:"var(--muted)",fontSize:"12px"}}>{inv.number}</td>
                    <td style={{fontWeight:500}}>{inv.client}</td>
                    <td className="tmono">{fmt(c.s)}</td>
                    <td className="tmono" style={{color:"var(--green)"}}>{fmt(c.g)}</td>
                    <td><SBadge s={inv.status}/></td>
                  </tr>
                );})}
                <tr style={{background:"var(--surface2)"}}>
                  <td colSpan={3} style={{fontWeight:700}}>Total</td>
                  <td className="tmono" style={{fontWeight:700}}>{fmt(allI.reduce((a,i)=>a+ci(i).s,0))}</td>
                  <td className="tmono" style={{fontWeight:700,color:"var(--green)"}}>{fmt(totC)}</td>
                  <td/>
                </tr>
              </tbody>
            </table>
          </div>
        ):(
          <div className="tscroll">
            <table>
              <thead><tr><th>Date</th><th>Category</th><th>Description</th><th>Excl. GST</th><th>ITC</th><th>Total Paid</th></tr></thead>
              <tbody>
                {creds.map((e,i)=>{const g=e.amount/11;return(
                  <tr key={i}>
                    <td style={{color:"var(--muted)",fontSize:"12px"}}>{fmtD(e.date)}</td>
                    <td><span className="badge bg-br">{e.category}</span></td>
                    <td>{e.desc}</td>
                    <td className="tmono">{fmt(e.amount-g)}</td>
                    <td className="tmono" style={{color:"var(--blue)"}}>{fmt(g)}</td>
                    <td className="tmono">{fmt(e.amount)}</td>
                  </tr>
                );})}
                <tr style={{background:"var(--surface2)"}}>
                  <td colSpan={3} style={{fontWeight:700}}>Total</td>
                  <td className="tmono" style={{fontWeight:700}}>{fmt(creds.reduce((a,e)=>a+(e.amount-e.amount/11),0))}</td>
                  <td className="tmono" style={{fontWeight:700,color:"var(--blue)"}}>{fmt(totI)}</td>
                  <td className="tmono" style={{fontWeight:700}}>{fmt(creds.reduce((a,e)=>a+e.amount,0))}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   BAS FORECASTING
══════════════════════════════════════════════════════════════════════════ */
const BQ = [
  {l:"Q1",p:"Jul – Sep",m:[6,7,8],due:"28 Oct"},
  {l:"Q2",p:"Oct – Dec",m:[9,10,11],due:"28 Feb"},
  {l:"Q3",p:"Jan – Mar",m:[0,1,2],due:"28 Apr"},
  {l:"Q4",p:"Apr – Jun",m:[3,4,5],due:"28 Jul"},
];

function BASForecasting({ invoices, expenses }) {
  const mo = new Date().getMonth();
  const cq = mo>=6&&mo<=8?0:mo>=9&&mo<=11?1:mo>=0&&mo<=2?2:3;
  const fy = new Date().getMonth()>=6?new Date().getFullYear():new Date().getFullYear()-1;

  const qd = BQ.map(q=>{
    const qi = invoices.filter(i=>q.m.includes(new Date(i.date).getMonth())&&i.status!=="draft");
    const qe = expenses.filter(e=>q.m.includes(new Date(e.date).getMonth()));
    const gc = qi.reduce((a,i)=>a+ci(i).g,0);
    const itc = qe.filter(e=>e.gstIncluded).reduce((a,e)=>a+e.amount/11,0);
    return {...q,gc,itc,net:gc-itc,sales:qi.reduce((a,i)=>a+ci(i).s,0),cnt:qi.length};
  });

  return (
    <div>
      <div className="ph">
        <div><div className="ph-title">BAS Forecast</div><div className="ph-sub">Financial Year {fy}/{fy+1}</div></div>
      </div>

      <div className="bas-g4" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"12px",marginBottom:"18px"}}>
        {qd.map((q,i)=>(
          <div key={i} className="bas-card" style={i===cq?{borderColor:"var(--brand)",background:"var(--brand-dim)"}:{}}>
            <div className="bas-ql">{q.l} {i===cq&&<span className="badge bg-br" style={{marginLeft:"4px",fontSize:"10px"}}>Now</span>}</div>
            <div className="bas-qp">{q.p} · Due {q.due}</div>
            <div className="bas-row"><span style={{color:"var(--muted)"}}>Sales (G1)</span><span className="tmono">{fmt(q.sales)}</span></div>
            <div className="bas-row"><span style={{color:"var(--muted)"}}>GST (1A)</span><span className="tmono" style={{color:"var(--green)"}}>{fmt(q.gc)}</span></div>
            <div className="bas-row"><span style={{color:"var(--muted)"}}>ITCs (1B)</span><span className="tmono" style={{color:"var(--blue)"}}>{fmt(q.itc)}</span></div>
            <div style={{fontWeight:700,fontSize:"11.5px",marginTop:"10px",color:"var(--muted)"}}>Net GST</div>
            <div className="bas-net" style={{color:q.net>0?"var(--red)":"var(--green)"}}>{fmt(Math.abs(q.net))}</div>
            <div style={{fontSize:"11px",color:q.net>0?"var(--red)":"var(--green)",marginTop:"2px"}}>{q.net>0?"Payable":q.net<0?"Refund":"Nil"}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{marginBottom:"14px"}}>
        <div className="sh2"><div className="sh2-title">Annual Summary</div></div>
        <div className="tscroll">
          <table>
            <thead><tr><th>Quarter</th><th>Period</th><th>Due</th><th>Total Sales</th><th>GST (1A)</th><th>ITCs (1B)</th><th>Net GST</th><th>Invoices</th></tr></thead>
            <tbody>
              {qd.map((q,i)=>(
                <tr key={i} style={i===cq?{background:"var(--brand-dim)"}:{}}>
                  <td style={{fontWeight:700}}>{q.l} {i===cq&&<span className="badge bg-br" style={{fontSize:"10px"}}>Now</span>}</td>
                  <td style={{color:"var(--muted)",fontSize:"12px"}}>{q.p}</td>
                  <td style={{color:"var(--muted)",fontSize:"12px"}}>{q.due}</td>
                  <td className="tmono">{fmt(q.sales)}</td>
                  <td className="tmono" style={{color:"var(--green)"}}>{fmt(q.gc)}</td>
                  <td className="tmono" style={{color:"var(--blue)"}}>{fmt(q.itc)}</td>
                  <td className="tmono" style={{color:q.net>0?"var(--red)":"var(--green)",fontWeight:700}}>{fmt(Math.abs(q.net))}</td>
                  <td style={{color:"var(--muted)"}}>{q.cnt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card" style={{borderColor:"rgba(27,110,74,.2)",background:"var(--brand-dim)"}}>
        <div style={{fontWeight:700,color:"var(--brand)",marginBottom:"11px",fontSize:"13.5px"}}>📋 BAS Lodgement Checklist</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:"8px"}}>
          {["Reconcile invoices with bank statements","Confirm all GST credits are valid","Check PAYG withholding (W1/W2)","Review FBT obligations","Verify fuel tax credits","Lodge via ATO Business Portal"].map((item,i)=>(
            <div key={i} style={{display:"flex",gap:"9px",fontSize:"12.5px",color:"var(--muted)",alignItems:"flex-start"}}>
              <span style={{color:"var(--brand)",flexShrink:0}}>○</span>{item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   AUTH – Brand Panel
══════════════════════════════════════════════════════════════════════════ */
function AuthBrand() {
  return (
    <div className="auth-brand">
      <div>
        <div className="ab-logo">The Busy <span>Bookie</span></div>
        <span className="ab-sub">Your Bookie, Your Business</span>
      </div>
      <div>
        <div className="ab-hl">GST, BAS &<br/><em>invoicing</em><br/>done for you.</div>
        <div className="ab-body">The Busy Bookie takes the stress out of bookkeeping for Australian small businesses — so you can focus on what you love.</div>
        <div className="ab-feats">
          {["ATO-compliant invoices with ABN","Auto GST & input tax credits","BAS forecasting (AU financial year)","AI receipt scanning & allocation","Works on phone, tablet & desktop"].map(f=>(
            <div className="ab-feat" key={f}><div className="ab-dot"/>{f}</div>
          ))}
        </div>
      </div>
      <div className="ab-foot">© {new Date().getFullYear()} The Busy Bookie · busybookie.com.au</div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   AUTH – Sign In
══════════════════════════════════════════════════════════════════════════ */
function SignIn({ onReg }) {
  const [email,setEmail]     = useState("");
  const [pass,setPass]       = useState("");
  const [err,setErr]         = useState("");
  const [loading,setLoading] = useState(false);

  const go = async () => {
    setErr("");
    if (!email||!pass){setErr("Please enter your email and password.");return;}
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) { setErr(error.message==="Invalid login credentials"?"Incorrect email or password.":error.message); setLoading(false); }
    // on success, onAuthStateChange in App fires automatically
  };

  return (
    <div className="auth-shell">
      <AuthBrand/>
      <div className="auth-panel">
        <div className="auth-mob-hd">
          <div className="auth-mob-circle1"/>
          <div className="auth-mob-circle2"/>
          <div className="auth-mob-logo">The Busy <span>Bookie</span></div>
          <div className="auth-mob-sub">Your Bookie, Your Business</div>
        </div>
        <div className="auth-box">
          <div className="auth-title">Welcome back</div>
          <div className="auth-sub">Sign in to your Busy Bookie account</div>
          <div className="auth-form">
            {err && <div className="auth-err">{err}</div>}
            <div className="field"><label>Email Address</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@business.com.au" onKeyDown={e=>e.key==="Enter"&&go()} autoComplete="email"/></div>
            <div className="field">
              <div className="auth-lrow"><label>Password</label><span className="auth-forgot">Forgot password?</span></div>
              <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&go()} autoComplete="current-password"/>
            </div>
            <button className="auth-btn" onClick={go} disabled={loading}>{loading?"Signing in…":"Sign In"}</button>
          </div>
          <div className="auth-sw">Don't have an account? <a onClick={onReg}>Create one free</a></div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   AUTH – Register
══════════════════════════════════════════════════════════════════════════ */
const ST = ["ACT","NSW","NT","QLD","SA","TAS","VIC","WA"];
const IND = ["Accounting & Finance","Construction & Development","Healthcare","Hospitality","Legal","Property & Real Estate","Retail","Technology","Trade & Labour","Transport & Logistics","Other"];
const PL = [{id:"starter",name:"Starter",price:"$0/mo",desc:"Up to 5 invoices/mo · 1 user · GST tracker"},{id:"pro",name:"Pro",price:"$29/mo",desc:"Unlimited invoices · BAS · AI receipt scanning"}];

function Register({ onSI }) {
  const [step,setStep]   = useState(0); // 0=role select, 1=business, 2=account, 3=plan
  const [role,setRole]   = useState("client"); // client | accountant
  const [biz,setBiz]     = useState({name:"",abn:"",state:"",industry:""});
  const [acct,setAcct]   = useState({first:"",last:"",email:"",pass:"",conf:""});
  const [plan,setPlan]   = useState("starter");
  const [err,setErr]     = useState("");
  const [loading,setL]   = useState(false);
  const [done,setDone]   = useState(false);

  const next = () => {
    setErr("");
    if(step===1){
      if(role==="accountant"){
        // Accountants don't need ABN/business details, just name
        if(!biz.name){setErr("Please enter your practice or business name.");return;}
      } else {
        if(!biz.name||!biz.abn||!biz.state){setErr("Please fill all required fields.");return;}
        if(!/^\d{11}$/.test(biz.abn.replace(/[\s\-]/g,""))){setErr("ABN must be 11 digits (e.g. 51 824 753 556).");return;}
      }
    }
    if(step===2){
      if(!acct.first||!acct.email||!acct.pass){setErr("Please fill all required fields.");return;}
      if(acct.pass.length<8){setErr("Password must be at least 8 characters.");return;}
      if(acct.pass!==acct.conf){setErr("Passwords do not match.");return;}
    }
    setStep(s=>s+1);
  };

  const create = async () => {
    setL(true); setErr("");
    const fullName = `${acct.first} ${acct.last}`.trim();
    const { data, error } = await supabase.auth.signUp({
      email: acct.email,
      password: acct.pass,
      options: {
        data: {
          name: fullName,
          business_name: biz.name,
          abn: biz.abn,
          state: biz.state,
          industry: biz.industry,
          role,
          plan,
        }
      }
    });
    if (error) { setErr(error.message); setL(false); return; }
    const { error: profErr } = await supabase.from("profiles").insert({
      id: data.user.id,
      email: acct.email,
      name: fullName,
      business_name: biz.name,
      abn: role==="accountant" ? "" : biz.abn,
      state: biz.state,
      industry: biz.industry,
      plan,
      role,
    });
    if (profErr) console.error("Profile insert error:", profErr.message);
    setDone(true); setL(false);
  };

  if(done) return (
    <div className="auth-shell">
      <AuthBrand/>
      <div className="auth-panel">
        <div className="auth-mob-hd"><div className="auth-mob-logo">The Busy <span>Bookie</span></div></div>
        <div className="auth-box" style={{textAlign:"center"}}>
          <div style={{fontSize:"52px",marginBottom:"14px"}}>🎉</div>
          <div className="auth-title">You're all set!</div>
          <div className="auth-sub" style={{marginBottom:"20px"}}>Your account is ready. Signing you in…</div>
          <div style={{width:"44px",height:"4px",background:"var(--brand)",borderRadius:"2px",margin:"0 auto"}}/>
        </div>
      </div>
    </div>
  );

  const totalSteps = role==="accountant" ? 3 : 4;
  const stepTitles = ["Who are you?","Your details","Create account","Choose a plan"];
  const stepSubs   = ["Tell us how you'll use The Busy Bookie","Tell us about your practice or business","Set up your login details","Start free, upgrade any time"];

  return (
    <div className="auth-shell">
      <AuthBrand/>
      <div className="auth-panel">
        <div className="auth-mob-hd">
          <div className="auth-mob-circle1"/>
          <div className="auth-mob-circle2"/>
          <div className="auth-mob-logo">The Busy <span>Bookie</span></div>
          <div className="auth-mob-sub">Your Bookie, Your Business</div>
        </div>
        <div className="auth-box">
          {step > 0 && <div className="pills">{Array.from({length:totalSteps-1},(_,i)=><div key={i} className={`pill ${i<step-1?"done":i===step-1?"active":""}`}/>)}</div>}
          <div className="auth-title">{stepTitles[step]}</div>
          <div className="auth-sub">{stepSubs[step]}</div>
          <div className="auth-form">
            {err && <div className="auth-err">{err}</div>}

            {step===0 && <>
              <div className="role-grid">
                <div className={`role-card ${role==="client"?"sel":""}`} onClick={()=>setRole("client")}>
                  <div className="role-card-icon">🏢</div>
                  <div className="role-card-name">Business Owner</div>
                  <div className="role-card-desc">I run a business and need to manage my GST, invoices and BAS</div>
                </div>
                <div className={`role-card ${role==="accountant"?"sel":""}`} onClick={()=>setRole("accountant")}>
                  <div className="role-card-icon">📊</div>
                  <div className="role-card-name">Accountant / Bookkeeper</div>
                  <div className="role-card-desc">I manage books for multiple clients and need to view their accounts</div>
                </div>
              </div>
              <button className="auth-btn" onClick={()=>setStep(1)}>Continue →</button>
            </>}

            {step===1 && <>
              <div className="field">
                <label>{role==="accountant"?"Practice / Firm Name *":"Business / Trading Name *"}</label>
                <input value={biz.name} onChange={e=>setBiz(b=>({...b,name:e.target.value}))} placeholder={role==="accountant"?"Smith & Associates":"Acme Services Pty Ltd"} autoComplete="organization"/>
              </div>
              {role==="client" && <>
                <div className="field"><label>ABN *</label><input value={biz.abn} onChange={e=>setBiz(b=>({...b,abn:e.target.value}))} placeholder="XX XXX XXX XXX" inputMode="numeric"/><div className="fhint">11-digit Australian Business Number</div></div>
                <div className="frow">
                  <div className="field"><label>State *</label><select value={biz.state} onChange={e=>setBiz(b=>({...b,state:e.target.value}))}><option value="">Select…</option>{ST.map(s=><option key={s}>{s}</option>)}</select></div>
                  <div className="field"><label>Industry</label><select value={biz.industry} onChange={e=>setBiz(b=>({...b,industry:e.target.value}))}><option value="">Select…</option>{IND.map(s=><option key={s}>{s}</option>)}</select></div>
                </div>
              </>}
              {role==="accountant" && <>
                <div className="frow">
                  <div className="field"><label>State *</label><select value={biz.state} onChange={e=>setBiz(b=>({...b,state:e.target.value}))}><option value="">Select…</option>{ST.map(s=><option key={s}>{s}</option>)}</select></div>
                  <div className="field"><label>Specialisation</label><select value={biz.industry} onChange={e=>setBiz(b=>({...b,industry:e.target.value}))}><option value="">Select…</option>{["Tax Agent","BAS Agent","Bookkeeper","CPA","CA","Other"].map(s=><option key={s}>{s}</option>)}</select></div>
                </div>
              </>}
              <div style={{display:"flex",gap:"9px"}}>
                <button className="auth-btn auth-btn-ghost" style={{border:"1.5px solid var(--border)"}} onClick={()=>{setStep(0);setErr("");}}>← Back</button>
                <button className="auth-btn" onClick={next}>Continue →</button>
              </div>
            </>}

            {step===2 && <>
              <div className="frow">
                <div className="field"><label>First Name *</label><input value={acct.first} onChange={e=>setAcct(a=>({...a,first:e.target.value}))} placeholder="Jane" autoComplete="given-name"/></div>
                <div className="field"><label>Last Name</label><input value={acct.last} onChange={e=>setAcct(a=>({...a,last:e.target.value}))} placeholder="Smith" autoComplete="family-name"/></div>
              </div>
              <div className="field"><label>Email *</label><input type="email" value={acct.email} onChange={e=>setAcct(a=>({...a,email:e.target.value}))} placeholder="you@business.com.au" autoComplete="email"/></div>
              <div className="field"><label>Password *</label><input type="password" value={acct.pass} onChange={e=>setAcct(a=>({...a,pass:e.target.value}))} placeholder="Min. 8 characters" autoComplete="new-password"/></div>
              <div className="field"><label>Confirm Password *</label><input type="password" value={acct.conf} onChange={e=>setAcct(a=>({...a,conf:e.target.value}))} placeholder="Repeat password" autoComplete="new-password"/></div>
              <div style={{display:"flex",gap:"9px"}}>
                <button className="auth-btn auth-btn-ghost" style={{border:"1.5px solid var(--border)"}} onClick={()=>{setStep(1);setErr("");}}>← Back</button>
                {role==="accountant"
                  ? <button className="auth-btn" onClick={create} disabled={loading}>{loading?"Creating account…":"Create Account"}</button>
                  : <button className="auth-btn" onClick={next}>Continue →</button>
                }
              </div>
            </>}

            {step===3 && role==="client" && <>
              <div className="plan-grid">
                {PL.map(p=>(
                  <div key={p.id} className={`plan-card ${plan===p.id?"sel":""}`} onClick={()=>setPlan(p.id)}>
                    <div className="plan-name">{p.name}</div>
                    <div className="plan-price">{p.price}</div>
                    <div className="plan-desc">{p.desc}</div>
                  </div>
                ))}
              </div>
              <div style={{fontSize:"11px",color:"var(--dim)",textAlign:"center"}}>All plans include GST tracking, BAS forecasting & ATO-compliant invoices.</div>
              <div style={{display:"flex",gap:"9px"}}>
                <button className="auth-btn auth-btn-ghost" style={{border:"1.5px solid var(--border)"}} onClick={()=>{setStep(2);setErr("");}}>← Back</button>
                <button className="auth-btn" onClick={create} disabled={loading}>{loading?"Creating account…":"Create Account"}</button>
              </div>
            </>}
          </div>
          <div className="auth-sw">Already have an account? <a onClick={onSI}>Sign in</a></div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   ONBOARDING TOUR
══════════════════════════════════════════════════════════════════════════ */
const TOUR_STEPS = [
  {
    title:"Welcome to The Busy Bookie! 🎉",
    body:"Your Australian bookkeeping app is ready. Let us show you around in 60 seconds. We'll walk through each key feature so you can hit the ground running.",
    target:null, // centred, no spotlight
    pos:"centre",
  },
  {
    title:"Dashboard",
    body:"Your financial overview at a glance — revenue collected, money outstanding, net GST payable, and total expenses. Everything updates in real time as you add invoices and expenses.",
    target:"dashboard",
    pos:"right",
  },
  {
    title:"Invoices",
    body:"Create ATO-compliant tax invoices with your ABN, GST per line item, and due dates. You can also scan a photo or PDF of an existing invoice and AI will read all the details automatically.",
    target:"invoices",
    pos:"right",
  },
  {
    title:"Expenses",
    body:"Log business expenses manually or drag and drop a receipt photo — AI reads the amount, date, category and GST automatically. Filter by status, category, or GST type.",
    target:"expenses",
    pos:"right",
  },
  {
    title:"GST Tracker",
    body:"Tracks GST collected on your invoices (1A) versus input tax credits on your expenses (1B). Net GST payable is calculated automatically — ready for your BAS.",
    target:"gst",
    pos:"right",
  },
  {
    title:"BAS Forecast",
    body:"Shows all four Australian financial year quarters with GST collected, input credits, and net payable per quarter. BAS due dates update automatically based on today's date.",
    target:"bas",
    pos:"right",
  },
  {
    title:"PAYG & Tax",
    body:"Add your employees to calculate PAYG withholding for W1/W2 on your BAS. The Company Tax section estimates your annual tax liability — including secondary job income and HECS repayments for sole traders.",
    target:"payg",
    pos:"right",
  },
  {
    title:"Tax Payments",
    body:"Track your ATO and Revenue NSW obligations. When you pay a tax bill, tap Mark Paid, enter the amount and reference number — it's recorded and removed from your outstanding list.",
    target:"taxpay",
    pos:"right",
  },
  {
    title:"Settings",
    body:"Update your business name and ABN, manage accountant access, and re-watch this tour any time. On mobile you can also sign out from here.",
    target:"settings",
    pos:"right",
  },
  {
    title:"You're all set! ✅",
    body:"Start by adding your first invoice or scanning a receipt. If you have an accountant, go to Settings and add their email — they'll get instant access to your books.",
    target:null,
    pos:"centre",
  },
];

function Tour({ onClose, goTo }) {
  const [step, setStep] = useState(0);
  const cur = TOUR_STEPS[step];
  const isLast = step === TOUR_STEPS.length - 1;

  const next = () => {
    if (isLast) { onClose(); return; }
    if (cur.target) goTo(cur.target);
    setStep(s => s + 1);
    // After changing page, highlight the sidebar item
  };

  const skip = () => { onClose(); };

  // Position the card
  const cardStyle = () => {
    if (cur.pos === "centre") return {
      top:"50%", left:"50%",
      transform:"translate(-50%,-50%)",
    };
    // Position near the sidebar item on desktop, top on mobile
    return {
      top:"50%", left:"50%",
      transform:"translate(-50%,-50%)",
    };
  };

  return (
    <>
      <div className="tour-backdrop" onClick={skip}/>
      <div className="tour-card" style={cardStyle()}>
        <div className="tour-badge">Tour · Step {step+1} of {TOUR_STEPS.length}</div>
        <div className="tour-title">{cur.title}</div>
        <div className="tour-body">{cur.body}</div>
        <div className="tour-footer">
          <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
            <div className="tour-dots">
              {TOUR_STEPS.map((_,i)=>(
                <div key={i} className={`tour-dot ${i===step?"on":""}`}
                  onClick={()=>setStep(i)} style={{cursor:"pointer"}}/>
              ))}
            </div>
            <button className="tour-skip" onClick={skip}>Skip tour</button>
          </div>
          <button className="tour-next" onClick={next}>
            {isLast?"Get started →":"Next →"}
          </button>
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   ACCOUNTANT PORTAL
══════════════════════════════════════════════════════════════════════════ */
function AccountantPortal({ user, profile, onViewClient, onSignOut }) {
  const [clients,setClients]         = useState([]);
  const [pending,setPending]         = useState([]);
  const [loading,setLoading]         = useState(true);
  const [inviteEmail,setInviteEmail] = useState("");
  const [inviteMsg,setInviteMsg]     = useState("");
  const [clientData,setClientData]   = useState({});

  useEffect(()=>{ loadClients(); },[]);

  const loadClients = async () => {
    setLoading(true);
    // Load accepted relationships
    const { data: rels } = await supabase
      .from("accountant_clients")
      .select("*, client:client_id(id,business_name,abn,state,email,name)")
      .eq("accountant_id", user.id)
      .eq("status","active");

    // Load pending requests sent to this accountant
    const { data: pends } = await supabase
      .from("accountant_clients")
      .select("*, client:client_id(id,business_name,abn,email,name)")
      .eq("accountant_id", user.id)
      .eq("status","pending");

    if (rels) {
      setClients(rels.map(r=>r.client).filter(Boolean));
      // Load quick stats for each client
      rels.forEach(async r => {
        if (!r.client) return;
        const [inv,exp] = await Promise.all([
          supabase.from("invoices").select("id,status,items").eq("user_id",r.client.id),
          supabase.from("expenses").select("amount,gst_included").eq("user_id",r.client.id),
        ]);
        const gstOwed = (inv.data||[]).filter(i=>i.status==="paid").reduce((s,i)=>{
          const g=(i.items||[]).reduce((a,it)=>a+(it.gst?it.qty*it.unit*0.1:0),0);
          return s+g;
        },0);
        const itc = (exp.data||[]).filter(e=>e.gst_included).reduce((s,e)=>s+e.amount/11,0);
        setClientData(d=>({...d,[r.client.id]:{invoices:(inv.data||[]).length,netGST:gstOwed-itc}}));
      });
    }
    if (pends) setPending(pends.map(r=>r.client).filter(Boolean));
    setLoading(false);
  };

  const acceptInvite = async (clientId) => {
    await supabase.from("accountant_clients").update({status:"active"})
      .eq("accountant_id",user.id).eq("client_id",clientId);
    loadClients();
  };

  const removeClient = async (clientId) => {
    await supabase.from("accountant_clients").delete()
      .eq("accountant_id",user.id).eq("client_id",clientId);
    setClients(c=>c.filter(x=>x.id!==clientId));
  };

  const sendInvite = async () => {
    if (!inviteEmail) return;
    // Find client by email
    const { data: clientProf } = await supabase
      .from("profiles").select("id,business_name").eq("email",inviteEmail.toLowerCase()).eq("role","client").single();
    if (!clientProf) { setInviteMsg("No client account found with that email."); return; }
    // Check not already linked
    const { data: existing } = await supabase.from("accountant_clients")
      .select("id").eq("accountant_id",user.id).eq("client_id",clientProf.id).single();
    if (existing) { setInviteMsg("Already linked with this client."); return; }
    await supabase.from("accountant_clients").insert({
      accountant_id: user.id, client_id: clientProf.id, status:"active"
    });
    setInviteMsg(`✓ Linked with ${clientProf.business_name} successfully.`);
    setInviteEmail("");
    loadClients();
  };

  const name = profile?.name || user.email;
  const initials = name ? name.split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase() : "?";

  return (
    <>
      <G/>
      <div className="topbar" style={{left:0}}>
        <div className="tb-l">
          <div style={{fontFamily:"var(--ff)",fontSize:"16px",fontWeight:800,color:"var(--text)"}}>
            The Busy <span style={{color:"var(--brand)"}}>Bookie</span>
            <span className="badge bg-br" style={{marginLeft:"10px",fontSize:"10px"}}>Accountant</span>
          </div>
        </div>
        <div className="tb-r">
          <span className="tb-name">{name}</span>
          <div className="tb-avatar">{initials}</div>
          <button className="tb-out" onClick={onSignOut}>Sign out</button>
        </div>
      </div>

      <div style={{marginTop:"calc(54px + var(--safe-t))",padding:"28px 24px",maxWidth:"960px",margin:"calc(54px + var(--safe-t)) auto 0",paddingLeft:"24px",paddingRight:"24px"}}>
        <div className="ph">
          <div>
            <div className="ph-title">My Clients</div>
            <div className="ph-sub">{profile?.business_name} · {clients.length} active {clients.length===1?"client":"clients"}</div>
          </div>
        </div>

        {/* Pending invites */}
        {pending.length > 0 && (
          <div style={{marginBottom:"24px"}}>
            <div className="sh2-title" style={{marginBottom:"12px"}}>⏳ Pending Requests</div>
            {pending.map(c=>(
              <div key={c.id} className="pending-invite">
                <div>
                  <div style={{fontWeight:600}}>{c.business_name}</div>
                  <div style={{fontSize:"12px",color:"var(--muted)"}}>{c.email}</div>
                </div>
                <div style={{display:"flex",gap:"8px"}}>
                  <button className="btn btn-p btn-sm" onClick={()=>acceptInvite(c.id)}>{Ic.check} Accept</button>
                  <button className="btn btn-d btn-sm" onClick={()=>removeClient(c.id)}>Decline</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add client */}
        <div className="card" style={{marginBottom:"24px"}}>
          <div className="sh2-title" style={{marginBottom:"14px"}}>Add a Client</div>
          <div style={{display:"flex",gap:"10px",flexWrap:"wrap",alignItems:"flex-end"}}>
            <div className="field" style={{flex:1,minWidth:"200px",marginBottom:0}}>
              <label>Client Email Address</label>
              <input type="email" value={inviteEmail} onChange={e=>setInviteEmail(e.target.value)} placeholder="client@business.com.au" onKeyDown={e=>e.key==="Enter"&&sendInvite()}/>
            </div>
            <button className="btn btn-p" onClick={sendInvite}>{Ic.clients} Link Client</button>
          </div>
          {inviteMsg && <div style={{marginTop:"10px",fontSize:"13px",color:inviteMsg.startsWith("✓")?"var(--green)":"var(--red)"}}>{inviteMsg}</div>}
          <div className="fhint" style={{marginTop:"8px"}}>Enter the email address your client used to register on The Busy Bookie.</div>
        </div>

        {/* Client list */}
        {loading ? (
          <div style={{textAlign:"center",padding:"40px",color:"var(--muted)"}}>Loading clients…</div>
        ) : clients.length === 0 ? (
          <div className="card" style={{textAlign:"center",padding:"48px 24px"}}>
            <div style={{fontSize:"40px",marginBottom:"12px"}}>👥</div>
            <div style={{fontFamily:"var(--ff)",fontSize:"18px",fontWeight:700,marginBottom:"8px"}}>No clients yet</div>
            <div style={{color:"var(--muted)",fontSize:"13.5px"}}>Add a client above using their registered email address.</div>
          </div>
        ) : (
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:"14px"}}>
            {clients.map(c=>{
              const stats = clientData[c.id] || {};
              return (
                <div key={c.id} className="client-card" onClick={()=>onViewClient(c)}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div>
                      <div className="client-card-name">{c.business_name}</div>
                      <div className="client-card-abn">{c.abn ? `ABN ${c.abn}` : c.email}</div>
                      {c.state && <span className="badge bg-br" style={{marginTop:"6px",fontSize:"10px"}}>{c.state}</span>}
                    </div>
                    <div style={{color:"var(--brand)",fontSize:"20px"}}>→</div>
                  </div>
                  <div className="client-card-stats">
                    <div className="client-stat">
                      <div className="client-stat-val">{stats.invoices||0}</div>
                      <div className="client-stat-lbl">Invoices</div>
                    </div>
                    <div className="client-stat">
                      <div className="client-stat-val" style={{color:stats.netGST>0?"var(--red)":"var(--green)",fontSize:"13px"}}>
                        {stats.netGST!=null?fmt(Math.abs(stats.netGST||0)):"—"}
                      </div>
                      <div className="client-stat-lbl">Net GST</div>
                    </div>
                    <div className="client-stat" style={{marginLeft:"auto"}}>
                      <div style={{fontSize:"11px",color:"var(--brand)",fontWeight:600}}>View →</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   SETTINGS (Client)
══════════════════════════════════════════════════════════════════════════ */
function Settings({ user, profile, signOut, onTour }) {
  const [inviteEmail,setInviteEmail] = useState("");
  const [msg,setMsg]                 = useState("");
  const [accountants,setAccountants] = useState([]);
  const [editing,setEditing]         = useState(false);
  const [bizForm,setBizForm]         = useState({
    business_name: profile?.business_name || user.user_metadata?.business_name || "",
    abn:           profile?.abn || user.user_metadata?.abn || "",
    state:         profile?.state || user.user_metadata?.state || "",
    industry:      profile?.industry || user.user_metadata?.industry || "",
  });
  const [saveMsg,setSaveMsg] = useState("");

  const saveBiz = async () => {
    const { error } = await supabase.from("profiles")
      .upsert({ id: user.id, email: user.email, ...bizForm, name: profile?.name || user.user_metadata?.name || "" });
    if (error) { setSaveMsg("Error saving — " + error.message); return; }
    await supabase.auth.updateUser({ data: { business_name: bizForm.business_name, abn: bizForm.abn } });
    setSaveMsg("✓ Saved successfully. Refresh the page to see updated details.");
    setEditing(false);
  };

  useEffect(()=>{ loadAccountants(); },[]);

  const loadAccountants = async () => {
    const { data } = await supabase
      .from("accountant_clients")
      .select("*, accountant:accountant_id(name,email,business_name)")
      .eq("client_id", user.id);
    if (data) setAccountants(data);
  };

  const inviteAccountant = async () => {
    if (!inviteEmail) return;
    const { data: acctProf } = await supabase
      .from("profiles").select("id,name,business_name").eq("email",inviteEmail.toLowerCase()).eq("role","accountant").single();
    if (!acctProf) { setMsg("No accountant account found with that email. They need to register first."); return; }
    const { data: existing } = await supabase.from("accountant_clients")
      .select("id,status").eq("accountant_id",acctProf.id).eq("client_id",user.id).single();
    if (existing) { setMsg(`Already linked with ${acctProf.name||acctProf.business_name}.`); return; }
    await supabase.from("accountant_clients").insert({
      accountant_id: acctProf.id, client_id: user.id, status:"active"
    });
    setMsg(`✓ ${acctProf.name||acctProf.business_name} has been linked to your account.`);
    setInviteEmail("");
    loadAccountants();
  };

  const removeAccountant = async (acctId) => {
    await supabase.from("accountant_clients").delete()
      .eq("accountant_id",acctId).eq("client_id",user.id);
    setAccountants(a=>a.filter(x=>x.accountant_id!==acctId));
  };

  return (
    <div>
      <div className="ph">
        <div><div className="ph-title">Settings</div><div className="ph-sub">Manage your account and accountant access</div></div>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:"18px"}}>
        {/* Business details */}
        <div className="card">
          <div className="sh2">
            <div className="sh2-title">Business Details</div>
            <button className="btn btn-g btn-sm" onClick={()=>setEditing(e=>!e)}>
              {editing ? "Cancel" : "✏️ Edit"}
            </button>
          </div>
          {saveMsg && <div style={{fontSize:"13px",color:saveMsg.startsWith("✓")?"var(--green)":"var(--red)",marginBottom:"12px"}}>{saveMsg}</div>}
          {editing ? (
            <div className="fstack">
              <div className="frow">
                <div className="field"><label>Business Name *</label><input value={bizForm.business_name} onChange={e=>setBizForm(f=>({...f,business_name:e.target.value}))} placeholder="Acme Pty Ltd"/></div>
                <div className="field"><label>ABN</label><input value={bizForm.abn} onChange={e=>setBizForm(f=>({...f,abn:e.target.value}))} placeholder="XX XXX XXX XXX" inputMode="numeric"/></div>
              </div>
              <div className="frow">
                <div className="field"><label>State</label>
                  <select value={bizForm.state} onChange={e=>setBizForm(f=>({...f,state:e.target.value}))}>
                    <option value="">Select…</option>
                    {["ACT","NSW","NT","QLD","SA","TAS","VIC","WA"].map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="field"><label>Industry</label>
                  <select value={bizForm.industry} onChange={e=>setBizForm(f=>({...f,industry:e.target.value}))}>
                    <option value="">Select…</option>
                    {["Accounting & Finance","Construction & Development","Healthcare","Hospitality","Legal","Property & Real Estate","Retail","Technology","Trade & Labour","Transport & Logistics","Other"].map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <button className="btn btn-p" onClick={saveBiz}>{Ic.check} Save Changes</button>
            </div>
          ) : (
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
              {[
                {l:"Business Name", v:profile?.business_name||user.user_metadata?.business_name},
                {l:"ABN",           v:profile?.abn||user.user_metadata?.abn},
                {l:"State",         v:profile?.state||user.user_metadata?.state},
                {l:"Industry",      v:profile?.industry||user.user_metadata?.industry},
                {l:"Email",         v:profile?.email||user.email},
                {l:"Plan",          v:profile?.plan||user.user_metadata?.plan},
              ].map(f=>(
                <div key={f.l}>
                  <div style={{fontSize:"10.5px",color:"var(--muted)",textTransform:"uppercase",letterSpacing:"1px",fontWeight:600,marginBottom:"3px"}}>{f.l}</div>
                  <div style={{fontSize:"14px",color:f.v?"var(--text)":"var(--dim)"}}>{f.v||<span style={{color:"var(--dim)",fontSize:"12px"}}>Not set — click Edit to add</span>}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Linked accountants */}
        <div className="card">
          <div className="sh2-title" style={{marginBottom:"6px"}}>Your Accountant Access</div>
          <div style={{fontSize:"13px",color:"var(--muted)",marginBottom:"16px"}}>Allow your accountant or bookkeeper to view your data on The Busy Bookie.</div>

          {accountants.length > 0 && (
            <div style={{display:"flex",flexDirection:"column",gap:"10px",marginBottom:"18px"}}>
              {accountants.map(a=>(
                <div key={a.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 14px",background:"var(--surface2)",borderRadius:"var(--r-sm)",flexWrap:"wrap",gap:"8px"}}>
                  <div>
                    <div style={{fontWeight:600,fontSize:"14px"}}>{a.accountant?.name||a.accountant?.business_name}</div>
                    <div style={{fontSize:"12px",color:"var(--muted)"}}>{a.accountant?.email} · <span className={`badge ${a.status==="active"?"bg-g":"bg-o"}`}>{a.status}</span></div>
                  </div>
                  <button className="btn btn-d btn-sm" onClick={()=>removeAccountant(a.accountant_id)}>{Ic.trash} Remove</button>
                </div>
              ))}
            </div>
          )}

          <div style={{display:"flex",gap:"10px",flexWrap:"wrap",alignItems:"flex-end"}}>
            <div className="field" style={{flex:1,minWidth:"200px",marginBottom:0}}>
              <label>Accountant's Email Address</label>
              <input type="email" value={inviteEmail} onChange={e=>setInviteEmail(e.target.value)} placeholder="accountant@firm.com.au" onKeyDown={e=>e.key==="Enter"&&inviteAccountant()}/>
            </div>
            <button className="btn btn-p" onClick={inviteAccountant}>{Ic.clients} Add Accountant</button>
          </div>
          {msg && <div style={{marginTop:"10px",fontSize:"13px",color:msg.startsWith("✓")?"var(--green)":"var(--red)"}}>{msg}</div>}
          <div className="fhint" style={{marginTop:"8px"}}>Enter the email your accountant used to register as an accountant on The Busy Bookie.</div>
        </div>
        {/* Tour + Sign out */}
        <div className="card">
          <div className="sh2-title" style={{marginBottom:"14px"}}>Help & Account</div>
          <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
            <button className="btn btn-g btn-blk"
              style={{justifyContent:"flex-start",gap:"10px",fontSize:"14px"}}
              onClick={onTour}>
              <span style={{fontSize:"18px"}}>🗺️</span>
              <div style={{textAlign:"left"}}>
                <div style={{fontWeight:600}}>Take a tour</div>
                <div style={{fontSize:"11.5px",color:"var(--muted)",fontWeight:400}}>Replay the onboarding walkthrough</div>
              </div>
            </button>
            <button className="btn btn-d btn-blk"
              style={{justifyContent:"flex-start",gap:"10px",fontSize:"14px"}}
              onClick={signOut}>
              <span style={{fontSize:"18px"}}>👋</span>
              <div style={{textAlign:"left"}}>
                <div style={{fontWeight:600}}>Sign Out</div>
                <div style={{fontSize:"11.5px",color:"var(--muted)",fontWeight:400}}>Sign out of {user.email}</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
/* ══════════════════════════════════════════════════════════════════════════
   PAYG WITHHOLDING
══════════════════════════════════════════════════════════════════════════ */
// Simplified ATO weekly tax table (FY2025-26) — scales to annual
const paygTax = (annualGross) => {
  if (annualGross <= 18200)  return 0;
  if (annualGross <= 37000)  return (annualGross - 18200) * 0.19;
  if (annualGross <= 45000)  return 3572 + (annualGross - 37000) * 0.325;
  if (annualGross <= 120000) return 6147 + (annualGross - 45000) * 0.325;
  if (annualGross <= 180000) return 29467 + (annualGross - 120000) * 0.37;
  return 51667 + (annualGross - 180000) * 0.45;
};
// Add 2% Medicare levy
const paygWithMedicare = (gross) => paygTax(gross) + (gross > 26000 ? gross * 0.02 : 0);

const PAYG_PERIODS = ["Weekly","Fortnightly","Monthly","Quarterly","Annually"];
const periodToAnnual = (amt, period) => {
  const m = {Weekly:52,Fortnightly:26,Monthly:12,Quarterly:4,Annually:1};
  return amt * (m[period]||1);
};
const annualToperiod = (amt, period) => {
  const m = {Weekly:52,Fortnightly:26,Monthly:12,Quarterly:4,Annually:1};
  return amt / (m[period]||1);
};

function PAYGWithholding() {
  const [employees, setEmployees] = useState([
    {id:1, name:"Employee 1", gross:5000, period:"Monthly", taxFreeThreshold:true},
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({name:"", gross:"", period:"Monthly", taxFreeThreshold:true});

  const addEmp = () => {
    if (!form.name || !form.gross) return;
    setEmployees(p=>[...p, {...form, id:Date.now(), gross:parseFloat(form.gross)}]);
    setForm({name:"", gross:"", period:"Monthly", taxFreeThreshold:true});
    setShowAdd(false);
  };

  const totalW1 = employees.reduce((s,e) => s + periodToAnnual(e.gross, e.period), 0);
  const totalW2 = employees.reduce((s,e) => {
    const annual = periodToAnnual(e.gross, e.period);
    // Tax-free threshold reduces tax by ~$3,572/yr
    const tax = paygWithMedicare(annual) - (e.taxFreeThreshold ? 0 : 0);
    return s + tax;
  }, 0);
  const nswPayrollTaxApplies = totalW1 > 1200000;
  const nswPayrollTax = nswPayrollTaxApplies ? (totalW1 - 1200000) * 0.0545 : 0;

  return (
    <div>
      <div className="ph">
        <div>
          <div className="ph-title">PAYG Withholding</div>
          <div className="ph-sub">Employee tax obligations · W1 & W2 for BAS · NSW Payroll Tax</div>
        </div>
        <button className="btn btn-p" onClick={()=>setShowAdd(s=>!s)}>{Ic.plus} Add Employee</button>
      </div>

      {/* Summary cards */}
      <div className="g4" style={{marginBottom:"20px"}}>
        <div className="card card-xs">
          <div className="sl">Total Gross Wages (W1)</div>
          <div className="sv">{fmt(totalW1)}</div>
          <div className="ss">Annual</div>
        </div>
        <div className="card card-xs">
          <div className="sl">Tax Withheld (W2)</div>
          <div className="sv r">{fmt(totalW2)}</div>
          <div className="ss">Annual estimate</div>
        </div>
        <div className="card card-xs">
          <div className="sl">Effective Rate</div>
          <div className="sv">{totalW1 > 0 ? ((totalW2/totalW1)*100).toFixed(1) : "0.0"}%</div>
          <div className="ss">Avg across all employees</div>
        </div>
        <div className="card card-xs" style={nswPayrollTaxApplies?{borderColor:"var(--orange)"}:{}}>
          <div className="sl">NSW Payroll Tax</div>
          <div className="sv" style={{color:nswPayrollTaxApplies?"var(--orange)":"var(--green)"}}>
            {nswPayrollTaxApplies ? fmt(nswPayrollTax) : "Nil"}
          </div>
          <div className="ss">{nswPayrollTaxApplies ? "5.45% on excess over $1.2M" : "Under $1.2M threshold"}</div>
        </div>
      </div>

      {/* Add employee form */}
      {showAdd && (
        <div className="card" style={{marginBottom:"18px"}}>
          <div className="sh2-title" style={{marginBottom:"14px"}}>Add Employee</div>
          <div className="fstack">
            <div className="frow">
              <div className="field"><label>Employee Name</label><input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="John Smith"/></div>
              <div className="field"><label>Gross Pay</label><input type="number" value={form.gross} onChange={e=>setForm(f=>({...f,gross:e.target.value}))} placeholder="5000" inputMode="decimal"/></div>
            </div>
            <div className="frow">
              <div className="field"><label>Pay Period</label>
                <select value={form.period} onChange={e=>setForm(f=>({...f,period:e.target.value}))}>
                  {PAYG_PERIODS.map(p=><option key={p}>{p}</option>)}
                </select>
              </div>
              <div className="field"><label>Tax-Free Threshold</label>
                <select value={form.taxFreeThreshold?"yes":"no"} onChange={e=>setForm(f=>({...f,taxFreeThreshold:e.target.value==="yes"}))}>
                  <option value="yes">Claims threshold</option>
                  <option value="no">Does not claim</option>
                </select>
              </div>
            </div>
            <div style={{display:"flex",gap:"9px"}}>
              <button className="btn btn-p" onClick={addEmp}>Add Employee</button>
              <button className="btn btn-g" onClick={()=>setShowAdd(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Employee list */}
      <div className="card" style={{marginBottom:"18px"}}>
        <div className="sh2"><div className="sh2-title">Employees</div></div>
        <div className="tscroll">
          <table>
            <thead><tr><th>Employee</th><th>Gross Pay</th><th>Period</th><th>Annual Gross</th><th>Est. Tax Withheld</th><th>Effective Rate</th><th></th></tr></thead>
            <tbody>
              {employees.map(e=>{
                const annual = periodToAnnual(e.gross, e.period);
                const tax = paygWithMedicare(annual);
                return (
                  <tr key={e.id}>
                    <td style={{fontWeight:500}}>{e.name}</td>
                    <td className="tmono">{fmt(e.gross)}</td>
                    <td style={{color:"var(--muted)",fontSize:"12.5px"}}>{e.period}</td>
                    <td className="tmono">{fmt(annual)}</td>
                    <td className="tmono" style={{color:"var(--red)"}}>{fmt(tax)}</td>
                    <td className="tmono">{annual>0?((tax/annual)*100).toFixed(1):0}%</td>
                    <td><button className="btn btn-d btn-sm" onClick={()=>setEmployees(p=>p.filter(x=>x.id!==e.id))}>{Ic.trash}</button></td>
                  </tr>
                );
              })}
              <tr style={{background:"var(--surface2)"}}>
                <td colSpan={3} style={{fontWeight:700}}>Annual Total</td>
                <td className="tmono" style={{fontWeight:700}}>{fmt(totalW1)}</td>
                <td className="tmono" style={{fontWeight:700,color:"var(--red)"}}>{fmt(totalW2)}</td>
                <td colSpan={2}/>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* BAS W1/W2 summary */}
      <div className="g2">
        <div className="card">
          <div className="sh2-title" style={{marginBottom:"14px"}}>BAS Labels — W Fields</div>
          {[
            {l:"W1 — Total salary, wages & other payments", v:fmt(totalW1/4), note:"Per quarter"},
            {l:"W2 — Amounts withheld from salary & wages", v:fmt(totalW2/4), note:"Per quarter"},
            {l:"W3 — Other withholding", v:"$0.00", note:"Enter manually if applicable"},
            {l:"W4 — PAYG instalment", v:"$0.00", note:"If registered for PAYG instalments"},
          ].map(r=>(
            <div key={r.l} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"10px 0",borderBottom:"1px solid var(--surface2)"}}>
              <div>
                <div style={{fontSize:"13px",fontWeight:500}}>{r.l}</div>
                <div style={{fontSize:"11.5px",color:"var(--muted)",marginTop:"2px"}}>{r.note}</div>
              </div>
              <span style={{fontFamily:"var(--ff)",fontSize:"16px",fontWeight:700,color:"var(--red)",flexShrink:0,marginLeft:"12px"}}>{r.v}</span>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="sh2-title" style={{marginBottom:"14px"}}>NSW Payroll Tax</div>
          <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
            <div style={{background:nswPayrollTaxApplies?"rgba(212,98,31,.08)":"var(--brand-dim)",borderRadius:"8px",padding:"14px",border:`1px solid ${nswPayrollTaxApplies?"rgba(212,98,31,.2)":"rgba(26,107,71,.2)"}`}}>
              <div style={{fontWeight:700,fontSize:"13.5px",color:nswPayrollTaxApplies?"var(--orange)":"var(--brand)",marginBottom:"6px"}}>
                {nswPayrollTaxApplies ? "⚠️ Payroll Tax Applies" : "✓ Below Threshold"}
              </div>
              <div style={{fontSize:"13px",color:"var(--muted)",lineHeight:1.7}}>
                {nswPayrollTaxApplies
                  ? `Your annual wages of ${fmt(totalW1)} exceed the $1,200,000 NSW threshold. Payroll tax of 5.45% applies on the excess.`
                  : `Your annual wages of ${fmt(totalW1)} are below the $1,200,000 NSW payroll tax threshold. No payroll tax is payable.`}
              </div>
            </div>
            {[
              {l:"Annual wages", v:fmt(totalW1)},
              {l:"NSW threshold", v:"$1,200,000"},
              {l:"Taxable wages", v:nswPayrollTaxApplies?fmt(totalW1-1200000):"$0.00"},
              {l:"Rate", v:"5.45%"},
              {l:"Annual payroll tax", v:fmt(nswPayrollTax)},
              {l:"Monthly liability", v:fmt(nswPayrollTax/12)},
            ].map(r=>(
              <div key={r.l} style={{display:"flex",justifyContent:"space-between",fontSize:"13px",padding:"4px 0",borderBottom:"1px solid var(--surface2)"}}>
                <span style={{color:"var(--muted)"}}>{r.l}</span>
                <span style={{fontWeight:600}}>{r.v}</span>
              </div>
            ))}
            <div style={{fontSize:"11.5px",color:"var(--dim)",lineHeight:1.6,marginTop:"4px"}}>
              Payroll tax is lodged monthly via Revenue NSW (revenue.nsw.gov.au). Annual reconciliation due 28 July each year.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   COMPANY TAX ESTIMATE
══════════════════════════════════════════════════════════════════════════ */
function CompanyTax({ invoices, expenses }) {
  const [entityType, setEntityType]           = useState(() => localStorage.getItem("bb_entity_type")||"company_small");
  const [otherIncome, setOtherIncome]         = useState("");
  const [otherDeductions, setOtherDeductions] = useState("");
  const [dividends, setDividends]             = useState("");
  const [employmentIncome, setEmploymentIncome]     = useState("");
  const [employerTaxWithheld, setEmployerTaxWithheld] = useState("");
  const [hasHECS, setHasHECS]               = useState(() => localStorage.getItem("bb_hecs_enabled")==="true");
  const [hecsBalance, setHecsBalance]       = useState(() => localStorage.getItem("bb_hecs_balance")||"");
  const [fy, setFy] = useState(new Date().getMonth()>=6?new Date().getFullYear():new Date().getFullYear()-1);

  // Persist HECS settings so Dashboard can read them
  const toggleHECS = (val) => {
    setHasHECS(val);
    localStorage.setItem("bb_hecs_enabled", val);
  };
  const updateHECSBalance = (val) => {
    setHecsBalance(val);
    localStorage.setItem("bb_hecs_balance", val);
  };
  const updateEntityType = (val) => {
    setEntityType(val);
    localStorage.setItem("bb_entity_type", val);
  };

  const paidRevenue  = invoices.filter(i=>i.status==="paid").reduce((s,i)=>s+ci(i).s,0);
  const totalExpense = expenses.reduce((s,e)=>s+(e.gstIncluded?e.amount-e.amount/11:e.amount),0);
  const other   = parseFloat(otherIncome)||0;
  const deduct  = parseFloat(otherDeductions)||0;
  const divIn   = parseFloat(dividends)||0;
  const empInc  = parseFloat(employmentIncome)||0;
  const empTax  = parseFloat(employerTaxWithheld)||0;
  const hecsBal = parseFloat(hecsBalance)||0;

  const grossIncome   = paidRevenue + other + divIn + empInc;
  const totalDeduct   = totalExpense + deduct;
  const taxableIncome = Math.max(0, grossIncome - totalDeduct);

  // HECS-HELP repayment thresholds FY2025-26
  const hecsRepaymentRate = (income) => {
    if (income < 54435)  return 0;
    if (income < 62850)  return 0.010;
    if (income < 66621)  return 0.020;
    if (income < 70619)  return 0.025;
    if (income < 74856)  return 0.030;
    if (income < 79347)  return 0.035;
    if (income < 84108)  return 0.040;
    if (income < 89155)  return 0.045;
    if (income < 94504)  return 0.050;
    if (income < 100175) return 0.055;
    if (income < 106186) return 0.060;
    if (income < 112557) return 0.065;
    if (income < 119310) return 0.070;
    if (income < 126468) return 0.075;
    if (income < 134057) return 0.080;
    if (income < 142101) return 0.085;
    if (income < 150627) return 0.090;
    if (income < 159664) return 0.095;
    return 0.100;
  };

  const hecsRate       = hecsRepaymentRate(taxableIncome);
  const hecsRepayment  = taxableIncome * hecsRate;
  const hecsMonthly    = hecsRepayment / 12;
  const yearsToPayOff  = hecsBal > 0 && hecsRepayment > 0 ? Math.ceil(hecsBal / hecsRepayment) : null;

  const RATES = {
    company_small: {rate:0.25, label:"Small Business Company (25%)", note:"Applies to companies with aggregated turnover under $50M that are base rate entities", franking:0.25},
    company_base:  {rate:0.30, label:"Standard Company (30%)",       note:"Applies to companies that do not qualify for the small business rate", franking:0.30},
    trust:         {rate:0.47, label:"Trust (top marginal rate est.)",note:"Trusts distribute income to beneficiaries — this is an estimate at top marginal rate", franking:0},
    sole_trader:   {rate:null, label:"Sole Trader / Individual",      note:"Uses ATO individual tax brackets including 2% Medicare levy. Enter your other job's income below so tax is calculated on your total income — not just business income.", franking:0},
  };

  const rateInfo = RATES[entityType];
  let taxPayable = 0;
  let taxOnEmploymentOnly = 0;

  if (entityType === "sole_trader") {
    // Tax on TOTAL income (business + employment)
    taxPayable = paygWithMedicare(taxableIncome);
    // Tax that would apply to employment income only (already withheld by employer)
    taxOnEmploymentOnly = paygWithMedicare(empInc);
  } else {
    taxPayable = taxableIncome * (rateInfo.rate||0);
  }

  // For sole trader: additional tax on top of what employer already withheld
  const additionalTaxOwed = entityType === "sole_trader"
    ? Math.max(0, taxPayable - empTax)
    : taxPayable;

  const frankingCredits    = divIn * (rateInfo.franking/(1-rateInfo.franking));
  const quarterlyInstalment = additionalTaxOwed / 4;

  return (
    <div>
      <div className="ph">
        <div>
          <div className="ph-title">Company Tax Estimate</div>
          <div className="ph-sub">FY{fy}/{fy+1} · Based on paid invoices and recorded expenses</div>
        </div>
        <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
          <div className="field" style={{marginBottom:0}}>
            <select value={fy} onChange={e=>setFy(Number(e.target.value))} style={{minHeight:"38px",fontSize:"13px"}}>
              {[2023,2024,2025,2026].map(y=><option key={y} value={y}>FY{y}/{y+1}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Entity type selector */}
      <div className="card" style={{marginBottom:"18px"}}>
        <div className="sh2-title" style={{marginBottom:"12px"}}>Entity Type</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:"9px"}}>
          {Object.entries(RATES).map(([k,v])=>(
            <div key={k} className={`plan-card ${entityType===k?"sel":""}`} onClick={()=>updateEntityType(k)} style={{textAlign:"left"}}>
              <div className="plan-name">{v.rate!=null?`${(v.rate*100).toFixed(0)}%`:"Brackets"}</div>
              <div style={{fontSize:"12px",fontWeight:600,color:"var(--text)",marginTop:"2px"}}>{v.label.split("(")[0].trim()}</div>
            </div>
          ))}
        </div>
        <div style={{fontSize:"12px",color:"var(--muted)",marginTop:"10px",lineHeight:1.6}}>
          {rateInfo.note}
        </div>
      </div>

      {/* Income breakdown */}
      <div className="g2" style={{marginBottom:"18px"}}>
        <div className="card">
          <div className="sh2-title" style={{marginBottom:"14px"}}>Income</div>
          <div className="fstack">
            <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid var(--surface2)"}}>
              <span style={{color:"var(--muted)",fontSize:"13px"}}>Revenue from paid invoices (this business)</span>
              <span style={{fontWeight:600}}>{fmt(paidRevenue)}</span>
            </div>
            {entityType==="sole_trader" && (
              <>
                <div style={{background:"rgba(37,99,168,.06)",border:"1px solid rgba(37,99,168,.15)",borderRadius:"8px",padding:"12px 14px",fontSize:"12.5px",color:"var(--blue)",lineHeight:1.6}}>
                  💼 <strong>Secondary Employment Income</strong> — Enter your gross income from your other job so your total tax is calculated correctly. Without this, the estimate will be too low.
                </div>
                <div className="frow">
                  <div className="field">
                    <label>Gross Employment Income (other job)</label>
                    <input type="number" value={employmentIncome} onChange={e=>setEmploymentIncome(e.target.value)} placeholder="0.00" inputMode="decimal"/>
                    <div className="fhint">Annual gross salary / wages from your employer (before tax)</div>
                  </div>
                  <div className="field">
                    <label>Tax Withheld by Employer</label>
                    <input type="number" value={employerTaxWithheld} onChange={e=>setEmployerTaxWithheld(e.target.value)} placeholder="0.00" inputMode="decimal"/>
                    <div className="fhint">From your payment summary or income statement in myGov</div>
                  </div>
                </div>
                {empInc > 0 && (
                  <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid var(--surface2)"}}>
                    <span style={{color:"var(--muted)",fontSize:"13px"}}>Employment income included in total</span>
                    <span style={{fontWeight:600,color:"var(--blue)"}}>{fmt(empInc)}</span>
                  </div>
                )}
              </>
            )}
            <div className="field"><label>Other Income (interest, rental, etc. excl. GST)</label><input type="number" value={otherIncome} onChange={e=>setOtherIncome(e.target.value)} placeholder="0.00" inputMode="decimal"/></div>
            <div className="field"><label>Franked Dividends Received</label><input type="number" value={dividends} onChange={e=>setDividends(e.target.value)} placeholder="0.00" inputMode="decimal"/></div>
            <div style={{background:"var(--brand-dim)",borderRadius:"7px",padding:"10px 13px"}}>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <span style={{fontWeight:700}}>Total Gross Income</span>
                <span style={{fontFamily:"var(--ff)",fontSize:"18px",fontWeight:700,color:"var(--brand)"}}>{fmt(grossIncome)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="sh2-title" style={{marginBottom:"14px"}}>Deductions</div>
          <div className="fstack">
            <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid var(--surface2)"}}>
              <span style={{color:"var(--muted)",fontSize:"13px"}}>Recorded expenses (excl. GST)</span>
              <span style={{fontWeight:600}}>{fmt(totalExpense)}</span>
            </div>
            <div className="field"><label>Additional Deductions (depreciation, etc.)</label><input type="number" value={otherDeductions} onChange={e=>setOtherDeductions(e.target.value)} placeholder="0.00" inputMode="decimal"/></div>
            <div style={{background:"var(--brand-dim)",borderRadius:"7px",padding:"10px 13px"}}>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <span style={{fontWeight:700}}>Total Deductions</span>
                <span style={{fontFamily:"var(--ff)",fontSize:"18px",fontWeight:700,color:"var(--brand)"}}>{fmt(totalDeduct)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tax summary */}
      <div className="card" style={{marginBottom:"18px"}}>
        <div className="sh2-title" style={{marginBottom:"16px"}}>Tax Summary — FY{fy}/{fy+1}</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:"14px",marginBottom:"20px"}}>
          {[
            {l:"Gross Income",          v:fmt(grossIncome),             c:""},
            {l:"Total Deductions",      v:fmt(totalDeduct),             c:""},
            {l:"Taxable Income",        v:fmt(taxableIncome),           c:"brand"},
            {l:"Tax Rate",             v:rateInfo.rate!=null?`${(rateInfo.rate*100)}%`:"Brackets", c:""},
            {l:"Total Tax on Income",   v:fmt(taxPayable),              c:"r"},
            {l:entityType==="sole_trader"&&empTax>0?"Less: Tax Already Withheld":"Quarterly Instalment",
              v:entityType==="sole_trader"&&empTax>0?`(${fmt(empTax)})`:fmt(quarterlyInstalment), c:""},
            ...(entityType==="sole_trader"&&empTax>0?[{l:"Additional Tax Owing", v:fmt(additionalTaxOwed), c:"r"}]:[]),
          ].map(s=>(
            <div key={s.l} className="card card-xs" style={{boxShadow:"none",background:s.l==="Additional Tax Owing"?"rgba(194,59,46,.06)":"var(--surface2)",border:s.l==="Additional Tax Owing"?"1px solid rgba(194,59,46,.2)":"none"}}>
              <div className="sl">{s.l}</div>
              <div className={`sv ${s.c}`} style={{fontSize:"18px"}}>{s.v}</div>
            </div>
          ))}
        </div>

        {entityType==="sole_trader" && empInc > 0 && (
          <div style={{background:"rgba(37,99,168,.06)",border:"1px solid rgba(37,99,168,.15)",borderRadius:"8px",padding:"13px 16px",fontSize:"13px",marginBottom:"16px",lineHeight:1.7}}>
            <strong style={{color:"var(--blue)"}}>How this is calculated:</strong>
            <div style={{color:"var(--muted)",marginTop:"6px"}}>
              Your total taxable income is <strong style={{color:"var(--text)"}}>{fmt(taxableIncome)}</strong> (business + employment income minus deductions).
              Tax on this total income is <strong style={{color:"var(--text)"}}>{fmt(taxPayable)}</strong>.
              Your employer has already withheld <strong style={{color:"var(--text)"}}>{fmt(empTax)}</strong>.
              You will owe an additional <strong style={{color:"var(--red)"}}>{fmt(additionalTaxOwed)}</strong> at tax time — set aside approximately <strong style={{color:"var(--red)"}}>{fmt(additionalTaxOwed/12)}/month</strong>.
            </div>
          </div>
        )}

        {frankingCredits > 0 && (
          <div style={{background:"var(--brand-dim)",borderRadius:"8px",padding:"12px 14px",fontSize:"13px",color:"var(--brand)",marginBottom:"14px"}}>
            💡 Estimated franking credits from dividends: <strong>{fmt(frankingCredits)}</strong> — these may reduce your net tax payable.
          </div>
        )}

        <div className="hr"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
          <div>
            <div style={{fontWeight:700,fontSize:"13.5px",marginBottom:"10px"}}>PAYG Instalment Schedule</div>
            {["Q1 — Jul–Sep","Q2 — Oct–Dec","Q3 — Jan–Mar","Q4 — Apr–Jun"].map((q,i)=>(
              <div key={q} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid var(--surface2)",fontSize:"13px"}}>
                <span style={{color:"var(--muted)"}}>{q}</span>
                <span style={{fontWeight:600,color:"var(--red)"}}>{fmt(quarterlyInstalment)}</span>
              </div>
            ))}
          </div>
          <div>
            <div style={{fontWeight:700,fontSize:"13.5px",marginBottom:"10px"}}>Key Dates (NSW)</div>
            {[
              {d:"28 Oct",  l:"Q1 PAYG instalment due"},
              {d:"28 Feb",  l:"Q2 PAYG instalment due"},
              {d:"28 Apr",  l:"Q3 PAYG instalment due"},
              {d:"28 Jul",  l:"Q4 instalment & annual return"},
              {d:"31 Oct",  l:"Company tax return due (if lodging yourself)"},
            ].map(r=>(
              <div key={r.d} style={{display:"flex",gap:"10px",padding:"6px 0",borderBottom:"1px solid var(--surface2)",fontSize:"12.5px"}}>
                <span style={{color:"var(--brand)",fontWeight:700,minWidth:"52px"}}>{r.d}</span>
                <span style={{color:"var(--muted)"}}>{r.l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HECS-HELP Card */}
      <div className="card" style={{marginBottom:"18px"}}>
        <div className="sh2">
          <div>
            <div className="sh2-title">HECS-HELP Repayment</div>
            <div style={{fontSize:"12px",color:"var(--muted)",marginTop:"2px"}}>Based on your total taxable income of {fmt(taxableIncome)}</div>
          </div>
          <div className="hecs-toggle" onClick={()=>toggleHECS(!hasHECS)}>
            <div className={`hecs-toggle-track ${hasHECS?"on":""}`}>
              <div className="hecs-toggle-thumb"/>
            </div>
            <span style={{fontSize:"13px",color:hasHECS?"var(--brand)":"var(--muted)",fontWeight:500}}>
              {hasHECS?"HECS enabled":"I have a HECS debt"}
            </span>
          </div>
        </div>

        {!hasHECS ? (
          <div style={{fontSize:"13px",color:"var(--dim)",fontStyle:"italic",padding:"8px 0"}}>
            Enable above if you have a HECS-HELP student loan debt. The repayment will be added to your tax obligations.
          </div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:"14px"}}>

            {/* Threshold status */}
            <div style={{
              background: hecsRate > 0 ? "rgba(212,98,31,.07)" : "var(--brand-dim)",
              border: `1px solid ${hecsRate > 0 ? "rgba(212,98,31,.2)" : "rgba(26,107,71,.2)"}`,
              borderRadius:"8px", padding:"13px 16px"
            }}>
              <div style={{fontWeight:700,fontSize:"13.5px",color:hecsRate>0?"var(--orange)":"var(--brand)",marginBottom:"5px"}}>
                {hecsRate > 0
                  ? `Repayment required — ${(hecsRate*100).toFixed(1)}% of taxable income`
                  : `Below repayment threshold ($54,435)`}
              </div>
              <div style={{fontSize:"12.5px",color:"var(--muted)",lineHeight:1.7}}>
                {hecsRate > 0
                  ? `At a taxable income of ${fmt(taxableIncome)}, your compulsory HECS-HELP repayment rate is ${(hecsRate*100).toFixed(1)}%. This is collected by the ATO when you lodge your tax return.`
                  : `Your taxable income is below the $54,435 minimum repayment threshold. No HECS repayment is required this financial year.`}
              </div>
            </div>

            {/* Repayment breakdown */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:"12px"}}>
              {[
                {l:"Taxable Income",      v:fmt(taxableIncome),               c:""},
                {l:"Repayment Rate",      v:hecsRate>0?`${(hecsRate*100).toFixed(1)}%`:"Nil", c:""},
                {l:"Annual Repayment",    v:fmt(hecsRepayment),               c:hecsRate>0?"r":""},
                {l:"Monthly to set aside",v:fmt(hecsMonthly),                 c:hecsRate>0?"r":""},
              ].map(s=>(
                <div key={s.l} className="card card-xs" style={{boxShadow:"none",background:"var(--surface2)"}}>
                  <div className="sl">{s.l}</div>
                  <div className={`sv ${s.c}`} style={{fontSize:"17px"}}>{s.v}</div>
                </div>
              ))}
            </div>

            {/* Optional balance field */}
            <div className="frow">
              <div className="field">
                <label>Current HECS-HELP Balance (optional)</label>
                <input type="number" value={hecsBalance} onChange={e=>updateHECSBalance(e.target.value)}
                  placeholder="e.g. 28000" inputMode="decimal"/>
                <div className="fhint">Find this in your myGov account → ATO → Loans</div>
              </div>
              {hecsBal > 0 && hecsRepayment > 0 && (
                <div className="field" style={{display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
                  <div style={{background:"var(--brand-dim)",border:"1px solid rgba(26,107,71,.15)",borderRadius:"8px",padding:"13px",fontSize:"13px"}}>
                    <div style={{fontWeight:700,color:"var(--brand)",marginBottom:"4px"}}>
                      ~{yearsToPayOff} year{yearsToPayOff!==1?"s":""} to pay off
                    </div>
                    <div style={{fontSize:"12px",color:"var(--muted)",lineHeight:1.6}}>
                      At {fmt(hecsRepayment)}/yr on current income.<br/>Balance is indexed to CPI each June.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Repayment threshold table */}
            <details style={{cursor:"pointer"}}>
              <summary style={{fontSize:"12.5px",color:"var(--brand)",fontWeight:600,padding:"4px 0",userSelect:"none"}}>
                View FY2025-26 repayment threshold table
              </summary>
              <div className="tscroll" style={{marginTop:"10px"}}>
                <table>
                  <thead><tr><th>Repayment Income</th><th>Rate</th><th>Example: $80k income</th></tr></thead>
                  <tbody>
                    {[
                      ["Below $54,435","Nil","$0"],
                      ["$54,435 – $62,849","1.0%","N/A"],
                      ["$62,850 – $66,620","2.0%","N/A"],
                      ["$66,621 – $70,618","2.5%","N/A"],
                      ["$70,619 – $74,855","3.0%","N/A"],
                      ["$74,856 – $79,346","3.5%","N/A"],
                      ["$79,347 – $84,107","4.0%","$3,200"],
                      ["$84,108 – $89,154","4.5%","N/A"],
                      ["$89,155 – $94,503","5.0%","N/A"],
                      ["$94,504 – $100,174","5.5%","N/A"],
                      ["$100,175 – $106,185","6.0%","N/A"],
                      ["$106,186 – $112,556","6.5%","N/A"],
                      ["$112,557 – $119,309","7.0%","N/A"],
                      ["$119,310 – $126,467","7.5%","N/A"],
                      ["$126,468 – $134,056","8.0%","N/A"],
                      ["$134,057 – $142,100","8.5%","N/A"],
                      ["$142,101 – $150,626","9.0%","N/A"],
                      ["$150,627 – $159,663","9.5%","N/A"],
                      ["$159,664 and above", "10.0%","N/A"],
                    ].map(([band,rate],i)=>(
                      <tr key={i} style={hecsRate===parseFloat(rate)/100?{background:"var(--brand-dim)",fontWeight:600}:{}}>
                        <td style={{fontSize:"12.5px"}}>{band}</td>
                        <td style={{fontSize:"12.5px",fontWeight:600,color:rate==="Nil"?"var(--green)":"var(--orange)"}}>{rate}</td>
                        <td style={{fontSize:"12px",color:"var(--muted)"}}>{band.includes("79,347")?"$3,200":"—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>

          </div>
        )}
      </div>

      <div className="card" style={{borderColor:"rgba(26,107,71,.2)",background:"var(--brand-dim)"}}>
        <div style={{fontWeight:700,color:"var(--brand)",marginBottom:"8px",fontSize:"13.5px"}}>⚠️ Important Disclaimer</div>
        <div style={{fontSize:"12.5px",color:"var(--muted)",lineHeight:1.7}}>
          This is an estimate only based on data entered in The Busy Bookie. It does not account for all tax adjustments, offsets, or concessions that may apply. The small business tax offset, R&D credits, instant asset write-off, and other concessions are not included. Always confirm your tax position with a registered tax agent or accountant before lodging. The ATO due dates shown are general — your specific dates may vary based on your tax agent arrangement.
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   NAV CONFIG
══════════════════════════════════════════════════════════════════════════ */
/* ══════════════════════════════════════════════════════════════════════════
   TAX PAYMENTS TRACKER
══════════════════════════════════════════════════════════════════════════ */
function TaxPayments({ invoices, expenses }) {
  const [payments, setPayments] = useState(() => {
    try { return JSON.parse(localStorage.getItem("bb_tax_payments")||"[]"); } catch { return []; }
  });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({type:"GST",amount:"",datePaid:"",period:"",reference:"",notes:""});
  const [confirm, setConfirm] = useState(null); // payment awaiting confirmation

  const save = (p) => {
    const updated = [...p];
    localStorage.setItem("bb_tax_payments", JSON.stringify(updated));
    return updated;
  };

  const addPayment = () => {
    if (!form.type||!form.amount||!form.datePaid) return;
    const np = [...payments, {...form, id:Date.now(), amount:parseFloat(form.amount), confirmedAt: new Date().toISOString()}];
    setPayments(save(np));
    setForm({type:"GST",amount:"",datePaid:"",period:"",reference:"",notes:""});
    setShowForm(false);
  };

  const removePayment = (id) => {
    const np = payments.filter(p=>p.id!==id);
    setPayments(save(np));
  };

  // Calculate obligations from data
  const mo = new Date().getMonth();
  const yr = new Date().getFullYear();
  const fy = mo>=6?yr:yr-1;
  const allInv = invoices.filter(i=>i.status!=="draft");
  const gstCollected = allInv.reduce((s,i)=>s+ci(i).g,0);
  const itcTotal = expenses.filter(e=>e.gstIncluded).reduce((s,e)=>s+e.amount/11,0);
  const netGST = Math.max(0, gstCollected-itcTotal);

  // Next BAS due date
  const nextBASLabel = mo>=6&&mo<=8?`28 Oct ${yr}`:mo>=9&&mo<=11?`28 Feb ${yr+1}`:mo>=0&&mo<=2?`28 Apr ${yr}`:`28 Jul ${yr}`;
  const nextBASPeriod = mo>=6&&mo<=8?`Q1 FY${fy+1}`:mo>=9&&mo<=11?`Q2 FY${fy+1}`:mo>=0&&mo<=2?`Q3 FY${fy+1}`:`Q4 FY${fy+1}`;

  // Days until due
  const daysUntil = (dateStr) => {
    try {
      // Parse "28 Oct 2026" style dates
      const d = new Date(dateStr);
      if (isNaN(d)) return 999;
      return Math.ceil((d - new Date()) / (1000 * 60 * 60 * 24));
    } catch { return 999; }
  };

  // Check if a period has been paid
  const isPaid = (type, period) => payments.some(p=>p.type===type&&p.period===period);
  const getPaid = (type, period) => payments.find(p=>p.type===type&&p.period===period);

  const OBLIGATIONS = [
    {
      type:"GST",
      label:"GST — BAS Lodgement",
      amount:netGST,
      dueDate:nextBASLabel,
      period:nextBASPeriod,
      description:"Net GST payable to ATO based on current invoices and expenses.",
      authority:"ATO",
      lodgeVia:"ATO Business Portal or registered tax agent",
    },
    {
      type:"PAYG",
      label:"PAYG Withholding",
      amount:0,
      dueDate:nextBASLabel,
      period:nextBASPeriod,
      description:"Employee tax withheld — reported as W2 on your BAS. Amount from PAYG section.",
      authority:"ATO",
      lodgeVia:"ATO Business Portal — include in BAS",
    },
    {
      type:"Company Tax Q1",
      label:`Company Tax Instalment — Q1`,
      amount:0,
      dueDate:`28 Oct ${yr}`,
      period:`Q1 FY${fy+1}`,
      description:"Quarterly PAYG instalment for company income tax. Amount from Company Tax section.",
      authority:"ATO",
      lodgeVia:"ATO Business Portal",
    },
    {
      type:"Company Tax Q2",
      label:`Company Tax Instalment — Q2`,
      amount:0,
      dueDate:`28 Feb ${yr+1}`,
      period:`Q2 FY${fy+1}`,
      description:"Quarterly PAYG instalment for company income tax.",
      authority:"ATO",
      lodgeVia:"ATO Business Portal",
    },
    {
      type:"NSW Payroll Tax",
      label:"NSW Payroll Tax",
      amount:0,
      dueDate:`7th of each month`,
      period:`Monthly`,
      description:"If wages exceed $1.2M/year. Lodge and pay via Revenue NSW monthly.",
      authority:"Revenue NSW",
      lodgeVia:"revenue.nsw.gov.au",
    },
  ];

  const TAX_TYPES = ["GST","PAYG","Company Tax Q1","Company Tax Q2","Company Tax Q3","Company Tax Q4","NSW Payroll Tax","FBT","Other"];

  const urgencyColor = (dateStr) => {
    if (dateStr.includes("month")) return "var(--muted)";
    try {
      const d = daysUntil(dateStr);
      if (d < 0)  return "var(--red)";
      if (d <= 14) return "var(--red)";
      if (d <= 30) return "var(--orange)";
      return "var(--green)";
    } catch { return "var(--muted)"; }
  };

  const urgencyLabel = (dateStr) => {
    if (dateStr.includes("month")) return "";
    try {
      const d = daysUntil(dateStr);
      if (d < 0)  return "OVERDUE";
      if (d === 0) return "DUE TODAY";
      if (d <= 7)  return `${d}d left`;
      if (d <= 30) return `${d} days`;
      return "";
    } catch { return ""; }
  };

  const totalPaid = payments.reduce((s,p)=>s+p.amount,0);
  const totalOwed = OBLIGATIONS.filter(o=>!isPaid(o.type,o.period)&&o.amount>0).reduce((s,o)=>s+o.amount,0);

  return (
    <div>
      <div className="ph">
        <div>
          <div className="ph-title">Tax Payments</div>
          <div className="ph-sub">Track ATO and Revenue NSW obligations · Confirm when paid</div>
        </div>
        <button className="btn btn-p" onClick={()=>setShowForm(s=>!s)}>{Ic.plus} Record Payment</button>
      </div>

      {/* Summary */}
      <div className="g3" style={{marginBottom:"20px"}}>
        <div className="card card-xs">
          <div className="sl">Outstanding Obligations</div>
          <div className="sv r">{fmt(totalOwed)}</div>
          <div className="ss">Estimated unpaid</div>
        </div>
        <div className="card card-xs">
          <div className="sl">Paid This Year</div>
          <div className="sv g">{fmt(totalPaid)}</div>
          <div className="ss">{payments.length} payment{payments.length!==1?"s":""} recorded</div>
        </div>
        <div className="card card-xs">
          <div className="sl">Next Due</div>
          <div className="sv" style={{fontSize:"16px",color:urgencyColor(nextBASLabel)}}>{nextBASLabel}</div>
          <div className="ss">BAS · {nextBASPeriod}</div>
        </div>
      </div>

      {/* Record payment form */}
      {showForm && (
        <div className="card" style={{marginBottom:"18px"}}>
          <div className="sh2-title" style={{marginBottom:"14px"}}>Record Tax Payment</div>
          <div className="fstack">
            <div className="frow">
              <div className="field"><label>Tax Type</label>
                <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
                  {TAX_TYPES.map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="field"><label>Amount Paid (AUD)</label>
                <input type="number" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))} placeholder="0.00" inputMode="decimal"/>
              </div>
            </div>
            <div className="frow">
              <div className="field"><label>Date Paid</label>
                <input type="date" value={form.datePaid} onChange={e=>setForm(f=>({...f,datePaid:e.target.value}))}/>
              </div>
              <div className="field"><label>Period (e.g. Q1 FY26)</label>
                <input value={form.period} onChange={e=>setForm(f=>({...f,period:e.target.value}))} placeholder="Q1 FY26"/>
              </div>
            </div>
            <div className="frow">
              <div className="field"><label>Reference / Receipt No.</label>
                <input value={form.reference} onChange={e=>setForm(f=>({...f,reference:e.target.value}))} placeholder="ATO payment reference"/>
              </div>
              <div className="field"><label>Notes</label>
                <input value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} placeholder="Optional notes"/>
              </div>
            </div>
            <div style={{display:"flex",gap:"9px",flexWrap:"wrap"}}>
              <button className="btn btn-p" onClick={addPayment}>{Ic.check} Confirm Payment</button>
              <button className="btn btn-g" onClick={()=>setShowForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming obligations */}
      <div className="card" style={{marginBottom:"18px"}}>
        <div className="sh2-title" style={{marginBottom:"14px"}}>Upcoming Obligations</div>
        <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
          {OBLIGATIONS.map((ob,i)=>{
            const paid = isPaid(ob.type, ob.period);
            const paidRec = getPaid(ob.type, ob.period);
            const urg = urgencyColor(ob.dueDate);
            const urgL = urgencyLabel(ob.dueDate);
            return (
              <div key={i} style={{
                border:`1.5px solid ${paid?"var(--border)":urg==="var(--red)"?"rgba(194,59,46,.3)":urg==="var(--orange)"?"rgba(212,98,31,.2)":"var(--border)"}`,
                borderRadius:"var(--r)",padding:"16px",
                background:paid?"var(--surface)":urg==="var(--red)"?"rgba(194,59,46,.04)":"var(--surface)",
                opacity:paid?0.7:1,
              }}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"12px",flexWrap:"wrap"}}>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"4px",flexWrap:"wrap"}}>
                      <span style={{fontWeight:700,fontSize:"14px"}}>{ob.label}</span>
                      {paid
                        ? <span className="badge bg-g">✓ Paid</span>
                        : urgL && <span className="badge" style={{background:urg==="var(--red)"?"rgba(194,59,46,.1)":"rgba(212,98,31,.1)",color:urg}}>{urgL}</span>
                      }
                    </div>
                    <div style={{fontSize:"12.5px",color:"var(--muted)",marginBottom:"6px"}}>{ob.description}</div>
                    <div style={{display:"flex",gap:"16px",fontSize:"12px",flexWrap:"wrap"}}>
                      <span style={{color:"var(--muted)"}}>Due: <strong style={{color:paid?"var(--muted)":urg}}>{ob.dueDate}</strong></span>
                      <span style={{color:"var(--muted)"}}>Period: <strong style={{color:"var(--text)"}}>{ob.period}</strong></span>
                      <span style={{color:"var(--muted)"}}>Via: {ob.authority}</span>
                    </div>
                    {paid && paidRec && (
                      <div style={{marginTop:"8px",fontSize:"12px",color:"var(--green)",background:"rgba(26,122,73,.06)",padding:"6px 10px",borderRadius:"6px"}}>
                        ✓ Paid {fmt(paidRec.amount)} on {fmtD(paidRec.datePaid)}{paidRec.reference?` · Ref: ${paidRec.reference}`:""}
                      </div>
                    )}
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    {ob.amount>0 && (
                      <div style={{fontFamily:"var(--ff)",fontSize:"20px",fontWeight:700,color:paid?"var(--muted)":urg,marginBottom:"6px"}}>
                        {fmt(ob.amount)}
                      </div>
                    )}
                    {!paid ? (
                      <button className="btn btn-p btn-sm"
                        onClick={()=>setConfirm(ob)}>
                        {Ic.check} Mark Paid
                      </button>
                    ) : (
                      <button className="btn btn-d btn-sm" onClick={()=>removePayment(paidRec.id)}>
                        Undo
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment history */}
      {payments.length > 0 && (
        <div className="card">
          <div className="sh2-title" style={{marginBottom:"14px"}}>Payment History</div>
          <div className="tscroll">
            <table>
              <thead><tr><th>Date Paid</th><th>Type</th><th>Period</th><th>Amount</th><th>Reference</th><th>Notes</th><th></th></tr></thead>
              <tbody>
                {[...payments].sort((a,b)=>new Date(b.datePaid)-new Date(a.datePaid)).map(p=>(
                  <tr key={p.id}>
                    <td style={{color:"var(--muted)",fontSize:"12.5px"}}>{fmtD(p.datePaid)}</td>
                    <td style={{fontWeight:500}}>{p.type}</td>
                    <td style={{color:"var(--muted)",fontSize:"12.5px"}}>{p.period}</td>
                    <td className="tmono" style={{color:"var(--green)",fontWeight:700}}>{fmt(p.amount)}</td>
                    <td style={{fontSize:"12.5px",color:"var(--muted)"}}>{p.reference||"—"}</td>
                    <td style={{fontSize:"12.5px",color:"var(--muted)"}}>{p.notes||"—"}</td>
                    <td><button className="btn btn-d btn-sm" onClick={()=>removePayment(p.id)}>{Ic.trash}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quick confirm modal */}
      {confirm && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}} onClick={()=>setConfirm(null)}>
          <div className="card" style={{maxWidth:"380px",width:"100%"}} onClick={ev=>ev.stopPropagation()}>
            <div style={{fontSize:"40px",textAlign:"center",marginBottom:"12px"}}>✅</div>
            <div className="sh2-title" style={{textAlign:"center",marginBottom:"8px"}}>Confirm Tax Payment</div>
            <div style={{fontSize:"13px",color:"var(--muted)",textAlign:"center",marginBottom:"20px"}}>
              Mark <strong style={{color:"var(--text)"}}>{confirm.label}</strong> for <strong style={{color:"var(--text)"}}>{confirm.period}</strong> as paid?
            </div>
            <div className="fstack">
              <div className="frow">
                <div className="field"><label>Amount Paid</label>
                  <input type="number" defaultValue={confirm.amount||""} id="cp-amount" placeholder="0.00" inputMode="decimal"/>
                </div>
                <div className="field"><label>Date Paid</label>
                  <input type="date" defaultValue={today()} id="cp-date"/>
                </div>
              </div>
              <div className="field"><label>Reference / Receipt No. (optional)</label>
                <input id="cp-ref" placeholder="ATO payment reference"/>
              </div>
            </div>
            <div style={{display:"flex",gap:"9px",marginTop:"16px"}}>
              <button className="btn btn-p btn-blk" onClick={()=>{
                const amt = parseFloat(document.getElementById("cp-amount")?.value)||0;
                const dt  = document.getElementById("cp-date")?.value||today();
                const ref = document.getElementById("cp-ref")?.value||"";
                const np = [...payments, {id:Date.now(),type:confirm.type,amount:amt,datePaid:dt,period:confirm.period,reference:ref,notes:"",confirmedAt:new Date().toISOString()}];
                setPayments(save(np));
                setConfirm(null);
              }}>
                {Ic.check} Confirm Payment
              </button>
              <button className="btn btn-g" onClick={()=>setConfirm(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   NAV CONFIG
══════════════════════════════════════════════════════════════════════════ */
const PAGES = [
  {id:"dashboard",label:"Dashboard",    icon:"dash",    section:"Main"},
  {id:"invoices", label:"Invoices",     icon:"inv",     section:"Main"},
  {id:"expenses", label:"Expenses",     icon:"exp",     section:"Main"},
  {id:"gst",      label:"GST Tracker",  icon:"gst",     section:"Tax"},
  {id:"bas",      label:"BAS Forecast", icon:"bas",     section:"Tax"},
  {id:"payg",     label:"PAYG & Payroll",icon:"payg",   section:"Tax"},
  {id:"comptax",  label:"Company Tax",  icon:"tax",     section:"Tax"},
  {id:"taxpay",   label:"Tax Payments", icon:"tax",     section:"Tax"},
  {id:"settings", label:"Settings",     icon:"settings",section:"Account"},
];
const BOT = [
  {id:"dashboard",label:"Home",     icon:"dash"},
  {id:"invoices", label:"Invoices", icon:"inv"},
  {id:"expenses", label:"Expenses", icon:"exp"},
  {id:"gst",      label:"GST",      icon:"gst"},
  {id:"settings", label:"Account",  icon:"settings"},
];

export default function App() {
  const [screen,setScreen]         = useState("signin");
  const [user,setUser]             = useState(null);
  const [profile,setProfile]       = useState(null);
  const [loading,setLoading]       = useState(true);
  const [page,setPage]             = useState("dashboard");
  const [invoices,setInvoices]     = useState([]);
  const [expenses,setExpenses]     = useState([]);
  const [sbOpen,setSbOpen]         = useState(false);
  const [viewingClient,setViewingClient] = useState(null);
  const [clientInvoices,setClientInvoices] = useState([]);
  const [clientExpenses,setClientExpenses] = useState([]);
  const [showTour,setShowTour]     = useState(false);

  const loadProfile = async (userId) => {
    // Try direct query first, fallback handles RLS issues
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    if (data) setProfile(data);
  };

  const loadUserData = async (userId) => {
    const [invRes, expRes] = await Promise.all([
      supabase.from("invoices").select("*").eq("user_id", userId).order("created_at"),
      supabase.from("expenses").select("*").eq("user_id", userId).order("created_at"),
    ]);
    if (invRes.data) setInvoices(invRes.data.map(r => ({
      id: r.id, number: r.number, client: r.client, abn: r.client_abn,
      address: r.address, date: r.date, due: r.due,
      items: r.items || [], status: r.status, notes: r.notes || "",
    })));
    if (expRes.data) setExpenses(expRes.data.map(r => ({
      id: r.id, date: r.date, category: r.category,
      desc: r.description, amount: Number(r.amount),
      gstIncluded: r.gst_included, status: r.status||"pending",
    })));
  };

  const loadClientData = async (clientId) => {
    const [invRes, expRes] = await Promise.all([
      supabase.from("invoices").select("*").eq("user_id", clientId).order("created_at"),
      supabase.from("expenses").select("*").eq("user_id", clientId).order("created_at"),
    ]);
    if (invRes.data) setClientInvoices(invRes.data.map(r => ({
      id: r.id, number: r.number, client: r.client, abn: r.client_abn,
      address: r.address, date: r.date, due: r.due,
      items: r.items || [], status: r.status, notes: r.notes || "",
    })));
    if (expRes.data) setClientExpenses(expRes.data.map(r => ({
      id: r.id, date: r.date, category: r.category,
      desc: r.description, amount: Number(r.amount),
      gstIncluded: r.gst_included, status: r.status||"pending",
    })));
  };

  const saveInvoice = async (inv, userId) => {
    const { data, error } = await supabase.from("invoices").insert({
      user_id: userId, number: inv.number, client: inv.client,
      client_abn: inv.abn, address: inv.address, date: inv.date,
      due: inv.due, items: inv.items, status: inv.status, notes: inv.notes,
    }).select().single();
    if (error) { console.error(error); return inv; }
    return { ...inv, id: data.id };
  };
  const updateInvoiceStatus = async (id, status) => { await supabase.from("invoices").update({ status }).eq("id", id); };
  const deleteInvoice = async (id) => { await supabase.from("invoices").delete().eq("id", id); };
  const saveExpense = async (exp, userId) => {
    const { data, error } = await supabase.from("expenses").insert({
      user_id: userId, date: exp.date, category: exp.category,
      description: exp.desc, amount: exp.amount,
      gst_included: exp.gstIncluded, status: exp.status||"pending",
    }).select().single();
    if (error) { console.error(error); return exp; }
    return { ...exp, id: data.id };
  };
  const deleteExpense = async (id) => { await supabase.from("expenses").delete().eq("id", id); };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) { loadProfile(session.user.id); loadUserData(session.user.id); }
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
        loadUserData(session.user.id);
        if (_event === "SIGNED_IN") {
          const seen = localStorage.getItem("bb_tour_" + session.user.id);
          if (!seen) {
            setTimeout(() => setShowTour(true), 900);
            localStorage.setItem("bb_tour_" + session.user.id, "1");
          }
        }
      } else {
        setProfile(null); setInvoices([]); setExpenses([]); setViewingClient(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const go      = p => { setPage(p); setSbOpen(false); };
  const signOut = async () => { await supabase.auth.signOut(); setPage("dashboard"); setViewingClient(null); };

  const handleViewClient = async (client) => {
    setViewingClient(client);
    setPage("dashboard");
    await loadClientData(client.id);
  };

  if (loading) return (
    <>
      <G/>
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"var(--bg)"}}>
        <div style={{textAlign:"center"}}>
          <div style={{fontFamily:"var(--ff)",fontSize:"22px",color:"var(--brand)",fontWeight:800,marginBottom:"12px"}}>The Busy <span style={{color:"var(--brand)"}}>Bookie</span></div>
          <div style={{width:"44px",height:"4px",background:"var(--brand)",borderRadius:"2px",margin:"0 auto",opacity:.5}}/>
        </div>
      </div>
    </>
  );

  if (!user) return (
    <>
      <G/>
      {screen==="register"
        ? <Register onSI={()=>setScreen("signin")}/>
        : <SignIn onReg={()=>setScreen("register")}/>}
    </>
  );

  // Accountant portal (no client selected)
  if (profile?.role === "accountant" && !viewingClient) return (
    <AccountantPortal
      user={user} profile={profile}
      onViewClient={handleViewClient}
      onSignOut={signOut}
    />
  );

  // Data to display — either own data or client's data (accountant view)
  const isAccountantView = !!viewingClient;
  const displayInvoices  = isAccountantView ? clientInvoices : invoices;
  const displayExpenses  = isAccountantView ? clientExpenses : expenses;
  const displayProfile   = isAccountantView ? viewingClient  : profile;

  const biz      = displayProfile?.business_name || user.user_metadata?.business_name || user.user_metadata?.name?.split(" ")[0] || user.email?.split("@")[0] || "Your Business";
  const abn      = displayProfile?.abn || user.user_metadata?.abn || "";
  const abnDisplay = abn ? `ABN ${abn}` : "Add ABN in Settings";
  const name     = profile?.name || user.user_metadata?.name || user.email;
  const initials = name ? name.split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase() : "?";
  const sections = [...new Set(PAGES.map(p=>p.section))];
  const label    = PAGES.find(p=>p.id===page)?.label||"";

  return (
    <>
      <G/>
      <div className={`sb-overlay ${sbOpen?"show":""}`} onClick={()=>setSbOpen(false)}/>

      <nav className={`sidebar ${sbOpen?"open":""}`}>
        <div className="sb-logo">
          <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
            <Elephant size={32}/>
            <div>
              <h1>The Busy <span>Bookie</span></h1>
              <em>Your Bookie, Your Business</em>
            </div>
          </div>
        </div>
        <div className="sb-nav">
          {sections.map(sec=>(
            <div key={sec}>
              <div className="sb-section">{sec}</div>
              {PAGES.filter(p=>p.section===sec).map(p=>(
                <div key={p.id} className={`sb-item ${page===p.id?"on":""}`} onClick={()=>go(p.id)}>
                  <span className="sb-icon">{Ic[p.icon]}</span>
                  <span>{p.label}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="sb-foot">{biz}<br/>{abnDisplay}<br/><span style={{color:"rgba(255,255,255,.18)"}}>busybookie.com.au</span></div>
      </nav>

      <header className="topbar">
        <div className="tb-l">
          <button className="menu-btn" onClick={()=>setSbOpen(s=>!s)} aria-label="Menu">{Ic.menu}</button>
          <div className="tb-title">{isAccountantView ? viewingClient.business_name : label}</div>
        </div>
        <div className="tb-r">
          <span className="tb-name">{name}</span>
          <div className="tb-avatar" title={user.email}>{initials}</div>
          <button className="tb-out" onClick={signOut}>Sign out</button>
        </div>
      </header>

      {/* Accountant viewing client banner */}
      {isAccountantView && (
        <div className="acct-banner">
          <div className="acct-banner-label">
            👁 Viewing as accountant: <em>{viewingClient.business_name}</em>
            {viewingClient.abn && <span style={{color:"rgba(255,255,255,.5)",fontSize:"12px"}}>ABN {viewingClient.abn}</span>}
          </div>
          <button className="btn btn-sm" style={{background:"rgba(255,255,255,.15)",color:"#fff",border:"1px solid rgba(255,255,255,.25)"}}
            onClick={()=>{setViewingClient(null);setClientInvoices([]);setClientExpenses([]);}}>
            ← Back to My Clients
          </button>
        </div>
      )}

      <main className="main" style={isAccountantView?{paddingTop:"calc(54px + var(--safe-t) + 44px + 22px)"}:{}}>
        {page==="dashboard" && <Dashboard invoices={displayInvoices} expenses={displayExpenses}/>}
        {page==="invoices"  && <Invoices  invoices={displayInvoices} setInvoices={isAccountantView?setClientInvoices:setInvoices} biz={biz} abn={abn}
          onSave={inv=>saveInvoice(inv, isAccountantView ? viewingClient.id : user.id)}
          onDelete={id=>{deleteInvoice(id);(isAccountantView?setClientInvoices:setInvoices)(p=>p.filter(i=>i.id!==id));}}
          onPaid={id=>{updateInvoiceStatus(id,"paid");(isAccountantView?setClientInvoices:setInvoices)(p=>p.map(i=>i.id===id?{...i,status:"paid"}:i));}}
        />}
        {page==="expenses"  && <Expenses  expenses={displayExpenses} setExpenses={isAccountantView?setClientExpenses:setExpenses}
          onSave={exp=>saveExpense(exp, isAccountantView ? viewingClient.id : user.id)}
          onDelete={id=>{deleteExpense(id);(isAccountantView?setClientExpenses:setExpenses)(p=>p.filter(e=>e.id!==id));}}
        />}
        {page==="gst"      && <GSTTracker invoices={displayInvoices} expenses={displayExpenses}/>}
        {page==="bas"      && <BASForecasting invoices={displayInvoices} expenses={displayExpenses}/>}
        {page==="payg"     && <PAYGWithholding/>}
        {page==="comptax"  && <CompanyTax invoices={displayInvoices} expenses={displayExpenses}/>}
        {page==="taxpay"   && <TaxPayments invoices={displayInvoices} expenses={displayExpenses}/>}
        {page==="settings"  && !isAccountantView && <Settings user={user} profile={profile} signOut={signOut} onTour={()=>setShowTour(true)}/>}
        {page==="settings"  && isAccountantView  && (
          <div className="card" style={{textAlign:"center",padding:"32px"}}>
            <div style={{color:"var(--muted)",fontSize:"14px"}}>Settings are not available in client view.</div>
          </div>
        )}
      </main>

      {/* Onboarding tour */}
      {showTour && (
        <Tour
          onClose={()=>setShowTour(false)}
          goTo={id=>{ go(id); }}
        />
      )}

      <nav className="bot-nav" aria-label="Main navigation">
        <div className="bot-nav-inner">
          {BOT.map(p=>(
            <div key={p.id} className={`bot-item ${page===p.id?"on":""}`} onClick={()=>go(p.id)} role="button" aria-label={p.label}>
              {Ic[p.icon]}
              <span>{p.label}</span>
            </div>
          ))}
        </div>
      </nav>

      {/* Bookie AI Chatbot */}
      <Chatbot user={user}/>
    </>
  );
}
