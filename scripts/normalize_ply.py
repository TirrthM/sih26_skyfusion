import open3d as o3d
import numpy as np
import sys
import os
import argparse

def normalize_ply(input_path, output_path, downsample_ratio=1.0):
    if not os.path.exists(input_path):
        print(f"Error: Could not find {input_path}")
        sys.exit(1)

    print(f"Loading point cloud from {input_path}...")
    pcd = o3d.io.read_point_cloud(input_path)
    
    if not pcd.has_points():
        print("Error: Point cloud is empty or failed to load.")
        sys.exit(1)
        
    num_points = len(pcd.points)
    
    # Downsample if requested
    if downsample_ratio < 1.0:
        print(f"Downsampling to {downsample_ratio*100}% of original points...")
        # random_down_sample requires open3d >= 0.12
        pcd = pcd.random_down_sample(downsample_ratio)
        new_num_points = len(pcd.points)
        print(f"Reduced points from {num_points} to {new_num_points}")
        num_points = new_num_points

    # Calculate bounds and center
    min_bound = pcd.get_min_bound()
    max_bound = pcd.get_max_bound()
    center = (min_bound + max_bound) / 2.0
    
    print("\nOriginal bounds (post-downsample):")
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
    
    print("\nValidation PASSED!")
    print(f"Exporting centered point cloud to {output_path}...")
    
    # Save the file (binary little endian is default for PLY in Open3D)
    o3d.io.write_point_cloud(output_path, pcd)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Normalize and optionally downsample a PLY point cloud.")
    parser.add_argument("input", help="Input PLY file path")
    parser.add_argument("output", help="Output PLY file path")
    parser.add_argument("--downsample", type=float, default=1.0, help="Fraction of points to keep (e.g. 0.15 for 15%)")
    args = parser.parse_args()

    normalize_ply(args.input, args.output, args.downsample)
