import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';
import { FormsModule } from '@angular/forms';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-threedgeneration',
  standalone: true,
  imports: [CommonModule, LottieComponent, FormsModule],
  templateUrl: './threedgeneration.component.html',
  styleUrls: ['./threedgeneration.component.scss']
})
export class ThreedgenerationComponent implements AfterViewInit, OnDestroy {
  @ViewChild('sceneContainer') sceneContainer!: ElementRef;

  // UI State
  description: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  animationState: 'idle' | 'loading' | 'success' | 'error' = 'idle';
  currentAnimation: AnimationItem | null = null;
  ///
  showDownloadButton: boolean = false;
  currentModelJson: any = null;
  // Three.js Scene Elements
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private currentObject: THREE.Object3D | null = null;
  private animationId: number | null = null;

  // API Configuration
  private apiUrl = 'http://localhost:1234/v1/chat/completions';

  // Animation Assets
  animationOptions: { [key: string]: AnimationOptions } = {
    idle: { path: 'assets/animations_3d/hello.json' },
    loading: { path: 'assets/animations_3d/working_on_it.json' },
    success: { path: 'assets/animations_3d/success.json' },
    error: { path: 'assets/animations_3d/error.json' }
  };

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    this.initThreeScene();
    setTimeout(() => this.adjustSceneSize(), 0); // 💥 Force correct size after view initialized
    window.addEventListener('resize', this.onWindowResize);
    this.setAnimationState('idle');
  }

  ngOnDestroy(): void {
    this.cleanupThreeScene();
    if (this.currentAnimation) {
      this.currentAnimation.destroy();
    }
}
private adjustSceneSize(): void {
  if (!this.renderer || !this.camera) return;

  const container = this.sceneContainer.nativeElement;
  const width = container.clientWidth;
  const height = container.clientHeight;

  this.camera.aspect = width / height;
  this.camera.updateProjectionMatrix();
  this.renderer.setSize(width, height);
}

  // Animation Handlers
  animationCreated(animation: AnimationItem): void {
    this.currentAnimation = animation;
    animation.setSpeed(1);
    animation.play();
  }

  private setAnimationState(state: 'idle' | 'loading' | 'success' | 'error') {
    this.animationState = state;
  }

  getStatusMessage(): string {
    switch (this.animationState) {
      case 'idle': return 'Describe your 3D model!';
      case 'loading': return 'Generating your model...';
      case 'success': return 'Model created successfully!';
      case 'error': return this.errorMessage || 'Something went wrong';
      default: return '';
    }
  }

  // Three.js Scene Management
  private initThreeScene(): void {
    const container = this.sceneContainer.nativeElement;
    
    // Scene Setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf0f0f0);

    // Camera Setup
    this.camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
    this.camera.position.set(0, 5, 15);

    // Renderer Setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    container.appendChild(this.renderer.domElement);

    // Controls Setup
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;

    // Lighting
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 20, 15);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);

    // Ground Plane
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 50),
      new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.8 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Grid Helper
    const gridHelper = new THREE.GridHelper(50, 50);
    this.scene.add(gridHelper);

    // Start Rendering Loop
    this.startRenderingLoop();
  }

  private startRenderingLoop(): void {
    const animate = () => {
      this.animationId = requestAnimationFrame(animate);
      
      // Check if required components still exist
      if (this.renderer && this.scene && this.camera) {
        this.controls?.update();
        this.renderer.render(this.scene, this.camera);
      } else {
        // Clean up if components are missing
        this.stopRenderingLoop();
      }
    };
    
    animate();
}
private stopRenderingLoop(): void {
  if (this.animationId) {
    cancelAnimationFrame(this.animationId);
    this.animationId = null;
  }
}

  private onWindowResize = (): void => {
    const container = this.sceneContainer.nativeElement;
    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(container.clientWidth, container.clientHeight);
  };

  private cleanupThreeScene(): void {
    this.stopRenderingLoop();
    window.removeEventListener('resize', this.onWindowResize);
    this.clearCurrentModel();
    
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.domElement.remove();
      this.renderer = null!;
    }
    
    if (this.controls) {
      this.controls.dispose();
      this.controls = null!;
    }
    
    this.scene = null!;
    this.camera = null!;
    this.showDownloadButton = false;
    this.currentModelJson = null;
}

  // Model Generation
  generateModel(): void {
    if (!this.description.trim()) {
      this.errorMessage = 'Please enter a description';
      this.setAnimationState('error');
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.setAnimationState('loading');
    this.clearCurrentModel();

    const requestBody = {
      model: "qwen2.5-7b-instruct-1m",
      messages: [
        {
          role: "system",
          content: `STRICT UNIVERSAL THREE.JS GENERATOR V12.0

1. ABSOLUTE RULES:
- OUTPUT MUST: Be pure THREE.ObjectLoader() JSON
- OUTPUT MUST NOT:
  * Contain Math.*, placeholders, or non-standard fields
  * Use wireframe for glow effects (use emissive)
  * Repeat identical geometries (reuse via indices)

2. DYNAMIC GENERATION GUIDE:
A) GEOMETRIES:
- If user says "floating", add "position":[0,Y,0] (Y>0)
- If user says "glowing", add "emissive":0xRRGGBB
- Organic → Sphere/TorusKnot
- Mechanical → Box/Cylinder

B) MATERIALS:
- "metallic" → metalness:0.8
- "transparent" → opacity:0.5, transparent:true

3. STRUCTURE TEMPLATE:
{
  "metadata": {"version":4.5},
  "geometries": [
    {"type":"<Geometry>","<dim1>":N,"<dim2>":N}
  ],
  "materials": [
    {"type":"MeshStandardMaterial","color":0xRRGGBB,"<property>":N}
  ],
  "object": {
    "children": [
      {"type":"Mesh","geometry":0,"material":0,"position":[N,N,N]}
    ]
  }
}

4. CURRENT REQUEST: ${this.description}`
        },
        {
          role: "user",
          content: this.description
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    };

    this.http.post(this.apiUrl, requestBody)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.handleApiError(error);
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (response: any) => this.handleApiResponse(response),
        error: (err) => console.error('Generation error:', err)
      });
  }

  private handleApiResponse(response: any): void {
    try {
      const content = response.choices?.[0]?.message?.content || '';
      this.currentModelJson = this.parseModelData(content);
      this.loadModelFromJson(this.currentModelJson);
      this.showDownloadButton = true; // Show download button
      this.setAnimationState('success');
    } catch (error) {
      console.error('Model processing failed:', error);
      this.showDownloadButton = false;
      this.setAnimationState('error');
    } finally {
      this.isLoading = false;
    }
  }
  downloadModelJson(): void {
    if (!this.currentModelJson) return;
    
    const jsonStr = JSON.stringify(this.currentModelJson, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = '3d-model.json';
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  }
  

  private parseModelData(content: string): any {
    // Extract JSON from markdown if present
    const jsonStart = Math.max(
      content.indexOf('{'),
      content.indexOf('```json') > -1 ? content.indexOf('```json') + 6 : 0
    );
    const jsonEnd = content.lastIndexOf('}') + 1;
    
    if (jsonStart === -1 || jsonEnd === 0) {
      throw new Error('No valid JSON found in response');
    }

    let jsonString = content.substring(jsonStart, jsonEnd);

    // Universal JSON cleaning
    jsonString = jsonString
      .replace(/\/\/.*$/gm, '') // Remove comments
      .replace(/Math\.PI/g, '3.14159265359') // Replace Math.PI
      .replace(/Math\.\w+\(([^)]+)\)/g, (match, p1) => {
        // Handle simple Math functions - ensure we return a string
        const parts = p1.split(',').map(parseFloat);
        if (match.includes('Math.min')) return Math.min(...parts).toString();
        if (match.includes('Math.max')) return Math.max(...parts).toString();
        return '0'; // Fallback for other Math functions
      })
      .replace(/0x([0-9a-fA-F]+)/g, '"0x$1"') // Quote hex colors
      .replace(/([{,]\s*)([a-zA-Z0-9_]+)(\s*:)/g, '$1"$2"$3') // Quote property names
      .replace(/'/g, '"') // Replace single quotes
      .replace(/,\s*([}\]])/g, '$1'); // Remove trailing commas

    try {
      const rawData = JSON.parse(jsonString);

      // Universal data processor
      const processValue = (value: any): any => {
        if (typeof value === 'string') {
          // Convert hex strings to numbers
          if (value.startsWith('0x')) {
            return parseInt(value.substring(2), 16);
          }
          // Convert numeric strings to numbers
          if (!isNaN(Number(value))) {
            return Number(value);
          }
          return value;
        }
        if (Array.isArray(value)) {
          return value.map(processValue);
        }
        if (typeof value === 'object' && value !== null) {
          const processed: any = {};
          for (const key in value) {
            processed[key] = processValue(value[key]);
          }
          return processed;
        }
        return value;
      };

      const processedData = processValue(rawData);

      // Ensure required structure exists
      return {
        metadata: processedData.metadata || { version: 4.5, type: 'Object' },
        geometries: processedData.geometries || [],
        materials: processedData.materials || [],
        object: {
          type: 'Scene',
          children: (processedData.object?.children || []).map((child: any) => ({
            type: child.type || 'Mesh',
            geometry: child.geometry,
            material: child.material,
            position: child.position || [0, 0, 0],
            rotation: child.rotation || [0, 0, 0],
            scale: child.scale || [1, 1, 1],
            userData: child.userData || {},
            ...(child.emissive ? { emissive: processValue(child.emissive) } : {})
          }))
        }
      };
    } catch (e) {
      console.error('JSON parsing failed:', e);
      throw new Error('Invalid JSON structure');
    }
}
  private processGeometries(geometries: any[]): any[] {
    return geometries.map(geom => {
      const processed: any = { type: geom.type };
      
      // Handle different geometry types
      switch (geom.type) {
        case 'BoxGeometry':
          processed.width = geom.width || geom.parameters?.[0] || 1;
          processed.height = geom.height || geom.parameters?.[1] || 1;
          processed.depth = geom.depth || geom.parameters?.[2] || 1;
          break;
        case 'SphereGeometry':
          processed.radius = geom.radius || geom.parameters?.[0] || 1;
          processed.widthSegments = geom.widthSegments || geom.parameters?.[1] || 32;
          processed.heightSegments = geom.heightSegments || geom.parameters?.[2] || 16;
          break;
        case 'CylinderGeometry':
          processed.radiusTop = geom.radiusTop || geom.parameters?.[0] || 1;
          processed.radiusBottom = geom.radiusBottom || geom.parameters?.[1] || 1;
          processed.height = geom.height || geom.parameters?.[2] || 1;
          break;
        default:
          // For other geometries, copy all properties
          Object.assign(processed, geom);
      }
      
      return processed;
    });
  }

  private processMaterials(materials: any[]): any[] {
    return materials.map(mat => {
      const processed: any = { type: mat.type || 'MeshStandardMaterial' };
      
      // Convert string colors to numbers
      if (typeof mat.color === 'string') {
        processed.color = parseInt(mat.color.replace('0x', ''), 16);
      } else {
        processed.color = mat.color || 0x808080;
      }
      
      // Handle material properties
      const props = ['roughness', 'metalness', 'emissive', 'transparent', 'opacity', 'side'];
      props.forEach(prop => {
        if (mat[prop] !== undefined) {
          processed[prop] = prop === 'emissive' && typeof mat[prop] === 'string' ?
            parseInt(mat.emissive.replace('0x', ''), 16) :
            mat[prop];
        }
      });
      
      return processed;
    });
  }

  private processObjects(children: any[]): any[] {
    return children.map(child => ({
      type: child.type || 'Mesh',
      geometry: child.geometry,
      material: child.material,
      position: child.position || [0, 0, 0],
      rotation: child.rotation || [0, 0, 0],
      scale: child.scale || [1, 1, 1],
      name: child.name || ''
    }));
  }

  private loadModelFromJson(modelData: any): void {
    // Create geometries with universal type handling
    const geometries = (modelData.geometries || []).map((geom: any) => {
      const params = { ...geom };
      delete params.type;
      delete params.uuid;

      switch (geom.type) {
        case 'Box':
        case 'BoxGeometry':
          return new THREE.BoxGeometry(
            params.width || 1,
            params.height || 1,
            params.depth || 1
          );
        case 'Sphere':
        case 'SphereGeometry':
          return new THREE.SphereGeometry(
            params.radius || 1,
            params.widthSegments || 32,
            params.heightSegments || 16
          );
        case 'Cylinder':
        case 'CylinderGeometry':
          return new THREE.CylinderGeometry(
            params.radiusTop || 1,
            params.radiusBottom || 1,
            params.height || 1,
            params.radialSegments || 32
          );
        case 'Plane':
        case 'PlaneGeometry':
          return new THREE.PlaneGeometry(
            params.width || 1,
            params.height || 1
          );
        default:
          console.warn(`Unknown geometry type: ${geom.type}, using BoxGeometry as fallback`);
          return new THREE.BoxGeometry(1, 1, 1);
      }
    });

    // Create materials with universal property handling
    const materials = (modelData.materials || []).map((mat: any) => {
      const material = new THREE.MeshStandardMaterial({
        color: mat.color || 0x808080,
        roughness: mat.roughness ?? 0.8,
        metalness: mat.metalness ?? 0,
        emissive: mat.emissive || 0x000000,
        transparent: mat.transparent || false,
        opacity: mat.opacity ?? 1,
        side: mat.side === 'DoubleSide' ? THREE.DoubleSide : THREE.FrontSide,
        ...mat // Include any additional material properties
      });
      return material;
    });

    // Create scene hierarchy with universal object handling
    const root = new THREE.Group();
    (modelData.object?.children || []).forEach((child: any) => {
      if (child.geometry !== undefined && child.material !== undefined) {
        const mesh = new THREE.Mesh(
          geometries[child.geometry],
          materials[child.material]
        );
        
        mesh.position.fromArray(child.position);
        if (child.rotation) mesh.rotation.fromArray(child.rotation);
        if (child.scale) mesh.scale.fromArray(child.scale);
        if (child.name) mesh.name = child.name;
        
        // Handle emissive property at object level (fallback)
        if (child.emissive) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m: THREE.Material) => {
              if (m instanceof THREE.MeshStandardMaterial) {
                m.emissive.setHex(child.emissive);
              }
            });
          } else if (mesh.material instanceof THREE.MeshStandardMaterial) {
            mesh.material.emissive.setHex(child.emissive);
          }
        }
        
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        root.add(mesh);
      } else if (child.type === 'Group') {
        const group = new THREE.Group();
        if (child.position) group.position.fromArray(child.position);
        if (child.rotation) group.rotation.fromArray(child.rotation);
        if (child.scale) group.scale.fromArray(child.scale);
        root.add(group);
      }
    });

    // Add to scene
    this.clearCurrentModel();
    this.currentObject = root;
    this.scene.add(root);

    // Universal model centering
    this.centerModelInView(root);
}

private centerModelInView(object: THREE.Object3D): void {
    const bbox = new THREE.Box3().setFromObject(object);
    const center = bbox.getCenter(new THREE.Vector3());
    const size = bbox.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    const cameraDistance = maxDim * 2;

    // Move object UP so it's fully above the ground
    const offsetY = size.y / 2; // Half height
    object.position.y += offsetY;

    // Move camera and update controls
    this.camera.position.set(center.x, center.y + offsetY, center.z + cameraDistance);
    this.controls.target.set(center.x, center.y + offsetY, center.z);
    this.controls.update();
  }


  private clearCurrentModel(): void {
    if (this.currentObject) {
      this.scene.remove(this.currentObject);
      
      // Dispose of geometries and materials
      this.currentObject.traverse(obj => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach(m => m.dispose());
          } else {
            obj.material?.dispose();
          }
        }
      });
      
      this.currentObject = null;
    }
  }

  private createDefaultModel(): void {
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(2, 2, 2),
      new THREE.MeshStandardMaterial({ color: 0x2194ce })
    );
    cube.position.y = 1;
    cube.castShadow = true;
    cube.receiveShadow = true;
    
    this.currentObject = cube;
    this.scene.add(cube);
    this.centerModelInView(cube);
  }

  private handleApiError(error: HttpErrorResponse): void {
    this.isLoading = false;
    this.errorMessage = error.status === 0 ? 
      'API server not responding' : 
      `Error: ${error.status} - ${error.message}`;
    this.setAnimationState('error');
    this.createDefaultModel();
  }
}
