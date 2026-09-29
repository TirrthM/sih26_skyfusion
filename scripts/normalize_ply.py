import open3d as o3d
import numpy as np
import sys
import os

def normalize_ply(input_path, output_path):
    if not os.path.exists(input_path):
        print(f"Error: Could not find {input_path}")
        sys.exit(1)

    print(f"Loading point cloud from {input_path}...")
    pcd = o3d.io.read_point_cloud(input_path)
    
    if not pcd.has_points():
        print("Error: Point cloud is empty or failed to load.")
        sys.exit(1)
        
    num_points = len(pcd.points)
    
    # Calculate bounds and center
    min_bound = pcd.get_min_bound()
    max_bound = pcd.get_max_bound()
    center = (min_bound + max_bound) / 2.0
    
    print("\nOriginal bounds:")
    print(f"    min XYZ: {min_bound}")
    print(f"    max XYZ: {max_bound}")
    print(f"    center:  {center}")
    
    print("\nApplied translation:")
    print(f"    [{-center[0]}, {-center[1]}, {-center[2]}]")
    
    # Translate
    pcd.translate(-center)
    
    # Calculate new bounds
    new_min = pcd.get_min_bound()
    new_max = pcd.get_max_bound()
    new_center = (new_min + new_max) / 2.0
    
    print("\nNew bounds:")
    print(f"    min XYZ: {new_min}")
    print(f"    max XYZ: {new_max}")
    
    print("\nNew bounding-box center:")
    print(f"    {new_center}")
    
    # Validation
    assert np.allclose(new_center, np.zeros(3), atol=1e-6), "Center is not approx [0,0,0]!"
    assert len(pcd.points) == num_points, "Number of points changed!"
    
    original_dims = max_bound - min_bound
    new_dims = new_max - new_min
    assert np.allclose(original_dims, new_dims, atol=1e-5), "Dimensions changed!"
    
    print("\nValidation PASSED!")
    print(f"Exporting centered point cloud to {output_path}...")
    
    # Save the file
    o3d.io.write_point_cloud(output_path, pcd)
    print("Done!")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python normalize_ply.py <input.ply> <output.ply>")
        sys.exit(1)
    
    normalize_ply(sys.argv[1], sys.argv[2])
