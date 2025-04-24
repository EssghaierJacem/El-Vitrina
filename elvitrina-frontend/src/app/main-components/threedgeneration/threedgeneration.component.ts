import { CommonModule } from '@angular/common';
import { Component, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ObjectLoader } from 'three';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-threedgeneration',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './threedgeneration.component.html',
  styleUrls: ['./threedgeneration.component.scss']
})
export class ThreedgenerationComponent implements AfterViewInit, OnDestroy {
  @ViewChild('sceneContainer') sceneContainer!: ElementRef;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private animationId!: number;
  private apiUrl = 'http://localhost:1234/v1/chat/completions';

  isLoading = false;
  errorMessage: string | null = null;
  currentModel: THREE.Object3D | null = null;

  constructor(private http: HttpClient) { }

  ngAfterViewInit(): void {
    this.init3DScene();
    this.addDefaultLights();
    this.addFloor();
    this.startAnimationLoop();
    this.handleWindowResize();
  }

  ngOnDestroy(): void {
    this.cleanupScene();
  }

  private init3DScene(): void {
    const container = this.sceneContainer.nativeElement;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf0f0f0);

    const aspectRatio = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    this.camera.position.set(0, 3, 5);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.shadowMap.enabled = true;
    container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
  }

  generateModel(description: string): void {
    if (!description.trim()) {
      this.errorMessage = 'Please enter a valid description';
      return;
    }
  
    this.isLoading = true;
    this.errorMessage = null;
    this.clearCurrentModel();
  
    const requestBody = {
      model: "qwen2.5-7b-instruct-1m",
      messages: [
        {
          role: "system",
          content: `You are a strict JSON generator for Three.js models. Follow these rules exactly:

          1. OUTPUT FORMAT:
             - Only pure JSON directly parsable by THREE.ObjectLoader().parse()
             - No markdown, no code blocks, no explanations
             - Must start with { and end with }
          
          2. STRUCTURE REQUIREMENTS:
             - Must include valid metadata with version 4.5
             - Must have geometries, materials, and object sections
             - All objects must include: position, rotation, scale
             - All meshes must have: castShadow: true and receiveShadow: true
          
          3. MODELING RULES (REALISTIC & LOGICAL):
             - Use only standard Three.js geometries (Box, Sphere, Cylinder, Plane, Cone, Torus, etc.)
             - Dimensions must be realistic and proportional (use meters as units)
             - Center the model around [0, 0, 0] for better balance and display
             - All positions must be spatially logical and consistent (e.g., no floating elements unless they should fly)
             - Group related elements (e.g. table with legs, chair with seat and back)
             - For furniture or architectural items, align elements correctly (e.g., legs under surface, backrests behind seat)
             - Use basic architectural logic (e.g., chairs don’t float, lights hang from ceilings, etc.)
          
          4. VISUAL:
             - Use varied, appropriate materials with hex colors (like wood, metal, fabric tones)
             - Include shadows and natural lighting settings
             - Avoid overlapping or intersecting meshes
          
          5. OUTPUT MUST BE STRICTLY:
             - Only valid JSON
             - No extra comments or explanations
             - No code block wrappers
             - Just the JSON object from { to }
          
          EXAMPLE OUTPUT:
          {
            "metadata": { "version": 4.5, "type": "Object" },
            "geometries": [{ "uuid": "box-geom", "type": "BoxGeometry", "width": 1, "height": 1, "depth": 1 }],
            "materials": [{ "uuid": "box-mat", "type": "MeshStandardMaterial", "color": 16711680 }],
            "object": {
              "uuid": "main", "type": "Group", "children": [
                {
                  "uuid": "box-1",
                  "type": "Mesh",
                  "geometry": "box-geom",
                  "material": "box-mat",
                  "position": [0, 0.5, 0],
                  "rotation": [0, 0, 0],
                  "scale": [1, 1, 1],
                  "castShadow": true,
                  "receiveShadow": true
                }
              ]
            }
          }`
          
        },
        {
          role: "user",
          content: `Generate a detailed Three.js model of exactly: ${description}

Output must be pure JSON that can be directly parsed by THREE.ObjectLoader() with no additional text or formatting.`
        }
      ],
      temperature: 0.2, // Lower temperature for more consistent JSON output
      max_tokens: 4000, // Increased token limit for complex models
      top_p: 0.95 ,     // Slightly constrains token selection for better structure
     
    };
  
    this.http.post(this.apiUrl, requestBody).subscribe({
      next: (response: any) => this.handleApiResponse(response),
      error: (error) => this.handleApiError(error)
    });
  }
  
  private handleApiResponse(response: any): void {
    try {
      const content = response.choices?.[0]?.message?.content || '';
      
      // Clean the content to extract only the JSON part
      let jsonString = content;
      
      // Handle cases where the response includes markdown code blocks
      if (jsonString.includes('json')) {
        const startIndex = jsonString.indexOf('json') + 7;
        const endIndex = jsonString.lastIndexOf('');
        if (endIndex > startIndex) {
          jsonString = jsonString.substring(startIndex, endIndex).trim();
        }
      }
      
      // Remove everything before the first '{' and after the last '}'
      const jsonStart = jsonString.indexOf('{');
      const jsonEnd = jsonString.lastIndexOf('}') + 1;
      
      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error('No valid JSON found in response');
      }
      
      jsonString = jsonString.substring(jsonStart, jsonEnd);
      
      // Parse the cleaned JSON string
      const parsed = JSON.parse(jsonString);
      this.loadModelFromJson(parsed);
    } catch (err) {
      console.error("Error parsing model:", err);
      this.errorMessage = "Invalid JSON received. Showing default model.";
      this.createDefaultModel();
    } finally {
      this.isLoading = false;
    }
  }
  
  private loadModelFromJson(modelData: any): void {
    const loader = new ObjectLoader();
    const model = loader.parse(modelData);

    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);

    this.currentModel = model;
    this.scene.add(model);
    this.zoomToFit(box);
  }

  private addDefaultLights(): void {
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 5);
    this.scene.add(dirLight);
  }

  private addFloor(): void {
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.MeshStandardMaterial({ color: 0xdddddd })
    );
    floor.position.y = -3;
    floor.rotation.x = -Math.PI / 2;
    this.scene.add(floor);
  }

  private zoomToFit(box: THREE.Box3): void {
    const size = box.getSize(new THREE.Vector3()).length();
    this.camera.position.z = size * 1.5;
    this.controls.target.copy(box.getCenter(new THREE.Vector3()));
    this.controls.update();
  }

  private createDefaultModel(): void {
    // Define the couch model JSON
    const couchModel = {
      "metadata": {
        "version": 4.5,
        "type": "Object",
        "generator": "Object3D.toJSON"
      },
      "geometries": [
        {
          "uuid": "couch-base",
          "type": "BoxGeometry",
          "width": 3,
          "height": 0.5,
          "depth": 1.2
        },
        {
          "uuid": "couch-back",
          "type": "BoxGeometry",
          "width": 3,
          "height": 0.8,
          "depth": 0.3
        },
        {
          "uuid": "couch-armrest",
          "type": "BoxGeometry",
          "width": 0.3,
          "height": 0.8,
          "depth": 1.2
        },
        {
          "uuid": "couch-cushion",
          "type": "BoxGeometry",
          "width": 0.9,
          "height": 0.2,
          "depth": 0.9
        }
      ],
      "materials": [
        {
          "uuid": "couch-material",
          "type": "MeshPhongMaterial",
          "color": 13406255,
          "emissive": 0,
          "specular": 1118481,
          "shininess": 30,
          "reflectivity": 1,
          "refractionRatio": 0.98
        },
        {
          "uuid": "cushion-material",
          "type": "MeshPhongMaterial",
          "color": 13406255,
          "emissive": 0,
          "specular": 1118481,
          "shininess": 15,
          "reflectivity": 1,
          "refractionRatio": 0.98
        }
      ],
      "object": {
        "uuid": "couch",
        "type": "Group",
        "name": "Couch",
        "position": [0, 0, 0],
        "rotation": [0, 0, 0],
        "scale": [1, 1, 1],
        "children": [
          {
            "uuid": "couch-base-obj",
            "type": "Mesh",
            "name": "CouchBase",
            "position": [0, 0.25, 0],
            "rotation": [0, 0, 0],
            "scale": [1, 1, 1],
            "geometry": "couch-base",
            "material": "couch-material"
          },
          {
            "uuid": "couch-back-obj",
            "type": "Mesh",
            "name": "CouchBack",
            "position": [0, 0.8, -0.45],
            "rotation": [0, 0, 0],
            "scale": [1, 1, 1],
            "geometry": "couch-back",
            "material": "couch-material"
          },
          {
            "uuid": "couch-armrest-left-obj",
            "type": "Mesh",
            "name": "CouchArmrestLeft",
            "position": [-1.35, 0.65, 0],
            "rotation": [0, 0, 0],
            "scale": [1, 1, 1],
            "geometry": "couch-armrest",
            "material": "couch-material"
          },
          {
            "uuid": "couch-armrest-right-obj",
            "type": "Mesh",
            "name": "CouchArmrestRight",
            "position": [1.35, 0.65, 0],
            "rotation": [0, 0, 0],
            "scale": [1, 1, 1],
            "geometry": "couch-armrest",
            "material": "couch-material"
          },
          {
            "uuid": "couch-cushion-left-obj",
            "type": "Mesh",
            "name": "CouchCushionLeft",
            "position": [-0.95, 0.6, 0],
            "rotation": [0, 0, 0],
            "scale": [1, 1, 1],
            "geometry": "couch-cushion",
            "material": "cushion-material"
          },
          {
            "uuid": "couch-cushion-middle-obj",
            "type": "Mesh",
            "name": "CouchCushionMiddle",
            "position": [0, 0.6, 0],
            "rotation": [0, 0, 0],
            "scale": [1, 1, 1],
            "geometry": "couch-cushion",
            "material": "cushion-material"
          },
          {
            "uuid": "couch-cushion-right-obj",
            "type": "Mesh",
            "name": "CouchCushionRight",
            "position": [0.95, 0.6, 0],
            "rotation": [0, 0, 0],
            "scale": [1, 1, 1],
            "geometry": "couch-cushion",
            "material": "cushion-material"
          }
        ]
      }
    };
  
    try {
      // Try to load the couch model
      const loader = new ObjectLoader();
      const model = loader.parse(couchModel);
  
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center);
  
      this.currentModel = model;
      this.scene.add(model);
      this.zoomToFit(box);
    } catch (err) {
      console.error("Error loading default couch model:", err);
      // Fallback to simple sphere if even the couch fails
      const geometry = new THREE.SphereGeometry(1, 32, 32);
      const material = new THREE.MeshStandardMaterial({ color: 0x3498db });
      const mesh = new THREE.Mesh(geometry, material);
  
      this.currentModel = mesh;
      this.scene.add(mesh);
      this.zoomToFit(new THREE.Box3().setFromObject(mesh));
    }
  }

  private clearCurrentModel(): void {
    if (this.currentModel) this.scene.remove(this.currentModel);
    this.currentModel = null;
  }

  private startAnimationLoop(): void {
    const animate = () => {
      this.animationId = requestAnimationFrame(animate);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }

  private handleWindowResize(): void {
    window.addEventListener('resize', () => {
      const container = this.sceneContainer.nativeElement;
      this.camera.aspect = container.clientWidth / container.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(container.clientWidth, container.clientHeight);
    });
  }

  private handleApiError(error: any): void {
    this.isLoading = false;
    this.errorMessage = 'Failed to generate model.';
    this.createDefaultModel();
  }

  private cleanupScene(): void {
    cancelAnimationFrame(this.animationId);
    if (this.renderer) this.renderer.dispose();
  }
}