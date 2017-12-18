import { createRenderer } from "fela";

import prefixer from "fela-plugin-prefixer";
import unit from "fela-plugin-unit";
import extend from "fela-plugin-extend";
import namedMediaQuery from "fela-plugin-named-media-query";

const EMediaDimensions = {
  BigScreenStart: 1024,
  TabletStart: 585,
  MobileSmallEnd: 290,
};

const mediaQueries = {
  bigScreenOnly: `@media (min-width: ${EMediaDimensions.BigScreenStart}px)`,
  tabletOnly: `@media (min-width: ${EMediaDimensions.TabletStart}px) and (max-width: ${EMediaDimensions.BigScreenStart -
    1}px)`,
  mobileOnly: `@media (max-width: ${EMediaDimensions.TabletStart - 1}px)`,
  smallMobileOnly: `@media (max-width: ${EMediaDimensions.MobileSmallEnd}px)`,
  tabletUpwards: `@media (min-width: ${EMediaDimensions.TabletStart}px)`,
  tabletDownwards: `@media (max-width: ${EMediaDimensions.BigScreenStart - 1}px)`,
};

const namedMediaQueryPlugin = namedMediaQuery(mediaQueries);

const unitPlugin = unit("em", {
  width: "%",
  height: "%",
});

export function getFelaRenderer() {
  return createRenderer({
    plugins: [extend(), prefixer(), namedMediaQueryPlugin],
  });
}

const scrollThumbBarColor = Colors.LightestBlueShadow;
const scrollBarTrackColor = Colors.LightBlueShadow;
const scrollBarSize = "0.5em";

const reactAspectRatioStyles = `[style*="--aspect-ratio"]>:first-child{width:100%}[style*="--aspect-ratio"]>img{height:auto}@supports (--custom:property){[style*="--aspect-ratio"]{position:relative}[style*="--aspect-ratio"]::before{content:"";display:block;padding-bottom:calc(100% / (var(--aspect-ratio)))}[style*="--aspect-ratio"]>:first-child{position:absolute;top:0;left:0;height:100%}}`;

const scrollbarsStaticStyles = `::-webkit-scrollbar{width:${scrollBarSize};height:${scrollBarSize};}::-webkit-scrollbar-thumb{background:${scrollThumbBarColor};}::-webkit-scrollbar-track{background:${scrollBarTrackColor};}`;
const resetStaticStyles = "a,abbr,acronym,address,applet,article,aside,audio,b,big,blockquote,body,canvas,caption,center,cite,code,dd,del,details,dfn,div,dl,dt,em,embed,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,html,i,iframe,img,ins,kbd,label,legend,li,mark,menu,nav,object,ol,output,p,pre,q,ruby,s,samp,section,small,span,strike,strong,sub,summary,sup,table,tbody,td,tfoot,th,thead,time,tr,tt,u,ul,var,video{margin:0;padding:0;border:0;font:inherit;vertical-align:baseline}article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{display:block}body{line-height:1}body *{box-sizing: border-box;}ol,ul{list-style:none}blockquote,q{quotes:none}blockquote:after,blockquote:before,q:after,q:before{content:'';content:none}table{border-collapse:collapse;border-spacing:0}";

const allStaticStyles = resetStaticStyles + scrollbarsStaticStyles + reactAspectRatioStyles;

export function addStaticStyles(renderer) {
  renderer.renderStatic(allStaticStyles);
}
