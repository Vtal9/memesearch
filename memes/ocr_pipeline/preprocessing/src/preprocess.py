import cv2
from pathlib import Path
import numpy as np


def read_files(images_dir):
    images = []
    for p in Path(images_dir).iterdir():
        if p.is_file() and (".jpg" in str(p) or ".png" in str(p) or ".jpeg" in str(p)):
            print(p)
            images.append(cv2.imread(str(p), 0))
    return images


def preprocess(images):
    preprocessing_images = []
    for img in images:
#_______________________________________
        # For finding edges

        def find_edges(img):
            ans = cv2.Canny(img, 100, 200)
            return ans

#_______________________________________
        # For finding white (any color) text 

        def find_colr_mask(img):
            # define range of color (for not grayscale / colorful images)
            # lower_color = np.array([110,50,50])
            # upper_color = np.array([130,255,255])
            lower_color = np.array([240])
            upper_color = np.array([255])
            ans = cv2.inRange(img, lower_color, upper_color)
            return ans

#_______________________________________
        # For thresholding image

        def threshold(img):
            ret,th1 = cv2.threshold(img,127,255,cv2.THRESH_BINARY)
            th2 = cv2.adaptiveThreshold(img,255,cv2.ADAPTIVE_THRESH_MEAN_C,\
                        cv2.THRESH_BINARY,11,2)
            th3 = cv2.adaptiveThreshold(img,255,cv2.ADAPTIVE_THRESH_GAUSSIAN_C,\
                        cv2.THRESH_BINARY,11,2)
            return th3 # try th1, th2

#_______________________________________
        # For finding gradients

        def gradient(img):
            laplacian = cv2.Laplacian(img,cv2.CV_64F)
            sobelx = cv2.Sobel(img,cv2.CV_64F,1,0,ksize=5)
            sobely = cv2.Sobel(img,cv2.CV_64F,0,1,ksize=5)
            return laplacian # try sobelx/sobely

#_______________________________________
        # for applying different kernels
        # I used averaging kernel    

        def apply_kernel(img):
            kernel_size = 2
            kernel = np.ones((kernel_size, kernel_size), np.float32)/(kernel_size**2)
            ans = cv2.filter2D(img, -1, kernel)
            return ans

#_______________________________________

        def best_preproccessing(img):
            img1 = apply_kernel(img)
            img2 = find_colr_mask(img1)
            ans = img2
            return ans
#_______________________________________

        preprocessing_img = best_preproccessing(img)
        preprocessing_images.append(preprocessing_img)

    preprocessed_images = [np.stack((img, img, img), axis=2) for img in preprocessing_images]

    return preprocessed_images


def main():
    images_dir = './preprocessing/test_images'
    result_dir = './preprocessing/result_images'

    images = read_files(images_dir)
    print(str(len(images)) + " images have been read")

    preprocessed_images = preprocess(images)

    Path(result_dir).mkdir(exist_ok=True)
    for i, preprocessed_image in enumerate(preprocessed_images):
        cv2.imwrite(result_dir + "/preprocessed_image_" + str(i) + ".jpg", preprocessed_image)


if __name__ == '__main__':
	main()