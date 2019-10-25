// COPYRIGHT © 2019 Esri
//
// All rights reserved under the copyright laws of the United States
// and applicable international laws, treaties, and conventions.
//
// This material is licensed for use under the Esri Master License
// Agreement (MLA), and is bound by the terms of that agreement.
// You may redistribute and use this code without modification,
// provided you adhere to the terms of the MLA and include this
// copyright notice.
//
// See use restrictions at http://www.esri.com/legal/pdfs/mla_e204_e300/english
//
// For additional information, contact:
// Environmental Systems Research Institute, Inc.
// Attn: Contracts and Legal Services Department
// 380 New York Street
// Redlands, California, USA 92373
// USA
//
// email: contracts@esri.com
//
// See http://js.arcgis.com/next/esri/copyright.txt for details.

define(["require","exports","../../../../core/tsSupport/extendsHelper","../../../../core/libs/gl-matrix-2/vec2f32","../../support/buffer/InterleavedLayout","../lib/GLMaterial","../lib/Material","../lib/Util","./internal/bufferWriterUtils","./internal/MaterialUtil","./renderers/MergedRenderer","../shaders/LineCalloutPrograms","../../../webgl/renderState"],function(e,t,r,i,n,o,a,s,f,l,c,p,u){function d(e,t,r){3===r.length?e.setUniform4f(t,r[0],r[1],r[2],1):e.setUniform4fv(t,r)}var m=function(e){function t(r,i){var n=e.call(this,i)||this;return n.params=l.copyParameters(r,v),n._uniqueMaterialIdentifier=t.uniqueMaterialIdentifier(n.params),n}return r(t,e),Object.defineProperty(t.prototype,"uniqueMaterialIdentifier",{get:function(){return this._uniqueMaterialIdentifier},enumerable:!0,configurable:!0}),t.prototype.dispose=function(){},t.prototype.getGLMaterials=function(){return{color:h,depthShadowMap:void 0,normal:void 0,depth:void 0,highlight:void 0}},t.prototype.intersect=function(e,t,r,i,n,o,a,s){},t.prototype.createBufferWriter=function(){return new S},t.prototype.createRenderer=function(e,t){return new c(e,t,this)},t.prototype.setParameterValues=function(e){l.updateParameters(this.params,e)&&(this._uniqueMaterialIdentifier=t.uniqueMaterialIdentifier(this.params),this.notifyDirty("matChanged"))},t.prototype.getParameters=function(){return this.params},t.uniqueMaterialIdentifier=function(e){return JSON.stringify({screenOffset:e.screenOffset||[0,0],centerOffsetUnits:e.centerOffsetUnits||"world"})},t}(a.Material),h=function(e){function t(t){var r=e.call(this,t)||this;return r.isRenderSlot=!0,r.updateParameters(),r}return r(t,e),t.prototype.updateParameters=function(){this.params=l.copyParameters(this.material.getParameters()),this.selectProgram()},t.prototype.selectProgram=function(){var e=this.params;this.renderProgram=this.programRep.getProgram(p.program,{occlTest:!!e.occlusionTest,verticalOffset:!!e.verticalOffset,screenSizePerspective:!!e.screenSizePerspective,depthHud:!1,depthHudAlignStart:!!e.depthHUDAlignStart,centerOffsetUnitsScreen:"screen"===e.centerOffsetUnits,slice:e.slicePlaneEnabled}),this.depthProgram=this.programRep.getProgram(p.program,{occlTest:!!e.occlusionTest,verticalOffset:!!e.verticalOffset,screenSizePerspective:!!e.screenSizePerspective,depthHud:!0,depthHudAlignStart:!!e.depthHUDAlignStart,centerOffsetUnitsScreen:"screen"===e.centerOffsetUnits,slice:e.slicePlaneEnabled}),this.renderPipelineState=u.makePipelineState({blending:u.separateBlendingParams(1,770,771,771),depthTest:{func:513},colorWrite:u.defaultColorWriteParams}),this.depthPipelineState=u.makePipelineState({depthTest:{func:513},depthWrite:u.defaultDepthWriteParams})},t.prototype.beginSlot=function(e){switch(e){case 18:return this.isRenderSlot=!0,!0;case 19:return this.isRenderSlot=!1,!0}return!1},Object.defineProperty(t.prototype,"program",{get:function(){return this.isRenderSlot?this.renderProgram:this.depthProgram},enumerable:!0,configurable:!0}),t.prototype.getProgram=function(){return this.program},t.prototype.getPrograms=function(){return[this.renderProgram,this.depthProgram]},t.prototype.getDrawMode=function(){return 4},t.prototype.bind=function(e,t){var r=t.cameraAboveGround?1:-1,i=this.program,n=this.params;e.bindProgram(i),i.setUniform1f("cameraGroundRelative",r),i.setUniform1f("polygonOffset",n.shaderPolygonOffset),i.setUniform4fv("viewport",t.viewport),i.setUniform1f("perDistancePixelRatio",Math.tan(t.fovY/2)/(t.viewport[2]/2)),i.setUniformMatrix4fv("viewNormal",t.viewInvTransp),i.setUniform1i("hudVisibilityTexture",0),e.bindTexture(t.hudVisibilityTexture,0),d(i,"color",n.color);var o=t.pixelRatio||1;i.setUniform1f("pixelRatio",o),i.setUniform2f("screenOffset",n.screenOffset[0]*o,n.screenOffset[1]*o),this.bindBorder(e,t),l.bindVerticalOffset(n.verticalOffset,t,i),this.bindSizing(e,t),l.bindScreenSizePerspective(n.screenSizePerspective,i),this.isRenderSlot?e.setPipelineState(this.renderPipelineState):e.setPipelineState(this.depthPipelineState)},t.prototype.bindView=function(e,t){var r=this.program,i=this.params;l.bindView(t.origin,t.view,r),l.bindCamPos(t.origin,t.viewInvTransp,r),i.slicePlaneEnabled&&l.bindSlicePlane(t.origin,t.slicePlane,r)},t.prototype.bindInstance=function(e,t){var r=this.program;r.setUniformMatrix4fv("model",t.transformation),r.setUniformMatrix4fv("modelNormal",t.transformationNormal)},t.prototype.release=function(e,t){},t.prototype.bindSizing=function(e,t){var r=this.program,i=this.params;r.setUniform2f("pixelToNDC",2/t.viewport[2],2/t.viewport[3]);var n=t.pixelRatio||1;r.setUniform1f("lineSize",Math.ceil(i.size)*n)},t.prototype.bindBorder=function(e,t){var r=this.program,i=this.params,n=t.pixelRatio||1;null!==i.borderColor?(d(r,"borderColor",i.borderColor),r.setUniform1f("borderSize",n)):(r.setUniform4f("borderColor",0,0,0,0),r.setUniform1f("borderSize",0))},t}(o),v={verticalOffset:null,screenSizePerspective:null,screenOffset:[0,0],color:[0,0,0,1],size:1,borderColor:null,occlusionTest:!1,shaderPolygonOffset:1e-5,depthHUDAlignStart:!1,centerOffsetUnits:"world",slicePlaneEnabled:!1},g=n.newLayout().vec3f(s.VertexAttrConstants.POSITION).vec3f(s.VertexAttrConstants.NORMAL).vec2f(s.VertexAttrConstants.UV0).vec4f(s.VertexAttrConstants.AUXPOS1),P=[i.vec2f32.fromValues(0,0),i.vec2f32.fromValues(1,0),i.vec2f32.fromValues(0,1),i.vec2f32.fromValues(1,0),i.vec2f32.fromValues(1,1),i.vec2f32.fromValues(0,1)],S=function(){function e(){this.vertexBufferLayout=g}return e.prototype.allocate=function(e){return this.vertexBufferLayout.createBuffer(e)},e.prototype.elementCount=function(e){return 6*e.indices[s.VertexAttrConstants.POSITION].length},e.prototype.write=function(e,t,r,i){f.writePosition(t.indices[s.VertexAttrConstants.POSITION],t.vertexAttr[s.VertexAttrConstants.POSITION].data,e.transformation,r.position,i,6),f.writeNormal(t.indices[s.VertexAttrConstants.NORMAL],t.vertexAttr[s.VertexAttrConstants.NORMAL].data,e.invTranspTransformation,r.normal,i,6),f.writeBufferVec4(t.indices[s.VertexAttrConstants.AUXPOS1],t.vertexAttr[s.VertexAttrConstants.AUXPOS1].data,r.auxpos1,i,6);for(var n=0;n<P.length;++n)r.uv0.setVec(i+n,P[n])},e}();return m});