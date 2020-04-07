# -*- coding: utf-8 -*-
import os
import numpy as np
import cv2
from . import imgproc

# borrowed from https://github.com/lengstrom/fast-style-transfer/blob/master/src/utils.py
def list_images(in_path, formats=[".jpg", ".jpeg", ".gif", ".png", ".pgm", ".bmp"]):
    img_files = []
    for (dirpath, _, filenames) in os.walk(in_path):
        for file in filenames:
            _, ext = os.path.splitext(file)
            ext = str.lower(ext)
            if ext in formats:
                img_files.append(os.path.join(dirpath, file))
    return img_files

def saveResult(img_file, img, boxes, dirname='./result/', verticals=None, texts=None):
        """ save text detection result one by one
        Args:
            img_file (str): image file name
            img (array): raw image context
            boxes (array): array of result file
                Shape: [num_detections, 4] for BB output / [num_detections, 4] for QUAD output
        Return:
            None
        """
        img = np.array(img)

        # make result file list
        filename, file_ext = os.path.splitext(os.path.basename(img_file))

        # result directory
        res_file = dirname + "res_" + filename + '.txt'
        res_img_file = dirname + "res_" + filename + '.jpg'

        if not os.path.isdir(dirname):
            os.mkdir(dirname)

        with open(res_file, 'w') as f:
            
            for i, box in enumerate(boxes):
                poly = np.array(box).astype(np.int32).reshape((-1))
                strResult = ','.join([str(p) for p in poly]) + ' ' + texts[i] + '\r\n'
                f.write(strResult)

                poly = poly.reshape(-1, 2)
                
                cv2.polylines(img, [poly.reshape((-1, 1, 2))], True, color=(0, 0, 255), thickness=2)
                ptColor = (0, 255, 255)
                if verticals is not None:
                    if verticals[i]:
                        ptColor = (255, 0, 0)

                #if texts is not None:
                #    font = cv2.FONT_HERSHEY_SIMPLEX
                #    font_scale = 0.5
                #    cv2.putText(img, "{}".format(texts[i]), (poly[0][0]+1, poly[0][1]+1), font, font_scale, (0, 0, 0), thickness=1)
                #    cv2.putText(img, "{}".format(texts[i]), tuple(poly[0]), font, font_scale, (0, 255, 255), thickness=1)

        # Save result image
        cv2.imwrite(res_img_file, img)

