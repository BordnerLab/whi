#target photoshop;
var runphotomergeFromScript = true; // must be before Photomerge include 
$.evalFile(app.path + "/"+ localize("$$$/ScriptingSupport/InstalledScripts=Presets/Scripts") + "/Photomerge.jsx");  
//@show include 

psdOpts = new PhotoshopSaveOptions(); 
psdOpts.embedColorProfile = true; 
psdOpts.alphaChannels = true; 
psdOpts.layers = true; 


var workFolder = Folder.selectDialog(); 
var folders = workFolder.getFiles( function( file ) { return file instanceof Folder; } ); 

for( var i = 0; i < folders.length; i++ ) 
{ 	
	var folder = folders[i]; 
	var fList = folder.getFiles( '*.tif' );

   // override Photomerge.jsx settings. Default rtgris "Auto". Uncomment to override the default. 
   photomerge.alignmentKey   = "Auto"; 
   //photomerge.alignmentKey   = "Prsp"; 
   //photomerge.alignmentKey   = "cylindrical"; 
   //photomerge.alignmentKey   = "spherical"; 
   //photomerge.alignmentKey   = "sceneCollage"; 
   //photomerge.alignmentKey   = "translation"; // "Reposition" in layout dialog    

   // other setting that may need to be changed. Defaults below 
   photomerge.advancedBlending      = true; // 'Bend Images Together' checkbox in dialog 
   photomerge.lensCorrection      = false; // Geometric Distortion Correction'checkbox in dialog 
   photomerge.removeVignette      = true; // 'Vignette Removal' checkbox in dialog 

   if( fList.length > 1 )
   {
	   photomerge.createPanorama(fList,false); 
   } 

   // The merged doc will be the activeDocument 
   // activeDocument.saveAs( new File( fList[0].parent + '/Stitch.psb' ) , psdOpts, true, Extension.LOWERCASE); 

	//   try to always save as psb for larger files
	savePSB(fList[0].parent + '/Stitch.psb');   
	activeDocument.close( SaveOptions.DONOTSAVECHANGES ); 
}

function savePSB(fileNameAndPath)
{
	function cTID(s) { return app.charIDToTypeID(s); };
	function sTID(s) { return app.stringIDToTypeID(s); };

	var desc19 = new ActionDescriptor();
     var desc20 = new ActionDescriptor();
	desc20.putBoolean( sTID('maximizeCompatibility'), true );
	desc19.putObject( cTID('As  '), cTID('Pht8'), desc20 );
    desc19.putPath( cTID('In  '), new File( fileNameAndPath ) );
    desc19.putBoolean( cTID('LwCs'), true );
    executeAction( cTID('save'), desc19, DialogModes.NO );
};