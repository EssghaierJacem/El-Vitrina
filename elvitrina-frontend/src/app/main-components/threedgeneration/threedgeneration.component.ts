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
      model: "claude-3.7-sonnet-reasoning-gemma3-12b",
      messages: [
        {
          role: "system",
          content: `You are a specialized 3D model generator API that outputs only valid Three.js JSON models.

CRITICAL REQUIREMENTS:
1. Return ONLY valid JSON with no additional text
2. Do not include backticks, markdown formatting, or explanations
3. JSON must be properly formatted for THREE.ObjectLoader().parse()
4. Start with { and end with }
5. Include proper metadata with version 4.5
6. Use standard Three.js geometry types (BoxGeometry, CylinderGeometry, SphereGeometry, etc.)
7. Include appropriate materials with realistic colors and properties
8. Ensure all parts have position, rotation, and scale values
9. Add castShadow and receiveShadow to all meshes

EXAMPLE STRUCTURE:
{
  "metadata": {
    "version": 4.5,
    "type": "Object"
  },
  "geometries": [...],
  "materials": [...],
  "object": {
    "uuid": "...",
    "type": "Group",
    "children": [...]
  }
}`
        },
        {
          role: "user",
          content: `Generate a detailed Three.js-compatible 3D model of: ${description}

Make it realistic with proper proportions and component relationships.`
        }
      ],
      temperature: 0.2, // Lower temperature for more consistent JSON output
      max_tokens: 4000, // Increased token limit for complex models
      top_p: 0.95      // Slightly constrains token selection for better structure
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
      if (jsonString.includes('```json')) {
        const startIndex = jsonString.indexOf('```json') + 7;
        const endIndex = jsonString.lastIndexOf('```');
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
