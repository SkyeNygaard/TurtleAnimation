// This would normally be a GLTF/GLB file, but for demonstration, here's a simple procedural turtle model
export default {
    "asset": {
        "version": "2.0",
        "generator": "Three.js"
    },
    "scene": 0,
    "scenes": [{"nodes": [0]}],
    "nodes": [{
        "mesh": 0,
        "name": "Turtle"
    }],
    "meshes": [{
        "primitives": [{
            "attributes": {
                "POSITION": 0,
                "NORMAL": 1,
                "TEXCOORD_0": 2
            },
            "indices": 3
        }]
    }],
    "animations": [{
        "name": "swim",
        "channels": [{
            "sampler": 0,
            "target": {
                "node": 0,
                "path": "rotation"
            }
        }],
        "samplers": [{
            "input": 4,
            "interpolation": "LINEAR",
            "output": 5
        }]
    }]
}
