import os

# Specify the starting directory for traversal
# You can use '.' for the current working directory
# or a specific path like '/path/to/your/directory'
start_directory = '/home/a_swi_nrd/Project/face-shape-analyzer/public/stylesheet/inventory0'

for dirpath, dirnames, filenames in os.walk(start_directory):
    # dirpath: The current directory being walked
    # dirnames: A list of subdirectories in dirpath
    # filenames: A list of non-directory files in dirpath

    #print(f"Current Directory: {dirpath}")
    if not(dirnames):
        n = 0
        f = []
        for i in filenames:
            fn = dirpath.split("/")[-1]
            if not(i.startswith(fn)):
                f.append(i)
            #print(fn)
        
        fi = 0
        for i in filenames:
            if not(os.path.exists(f"{dirpath}/{fn}_{n}.jpg")) and not(os.path.exists(f"{dirpath}/{fn}_{n}.png")) :
                print(f[fi])
                file = f[fi].split(".")
                print(f"modified \"{f[fi]}\" to \"{fn}_{n}.{file[-1]}\"")
                os.system(f"mv \"{dirpath}/{f[fi]}\" \"{dirpath}/{fn}_{n}.{file[-1]}\"")
                fi += 1
                if fi >= len(f):
                    break
            n += 1

            '''
            if file[1] != "jpg" and not(dirnames):
                os.system(f"mv \"{dirpath}/{i}\" \"{dirpath}/{file[0]}.jpg\"")'''
        '''
        if dirnames:
            print(f"  Subdirectories: {', '.join(dirnames)}")
        
        if filenames:
            print(f"  Files: {', '.join(filenames)}")
        
        print("-" * 20) # Separator for clarity'''
print("complete!!!")