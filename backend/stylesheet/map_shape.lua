#! /usr/bin/env lua

-- # scope
-- this cli tool is used to manage shape_hairstyle_map.json file
-- it should be able to add and remove hairstyles to each shapes
-- ./map_shape remove oval crew_cut
-- ./map_shape <operation> <shape> <hairstyle>


-- to run this lua script,
-- install luarocks and install the following libraries first.
local lfs = require "lfs"     -- sudo luarocks install luafilesystem
local json = require "dkjson" -- sudo luarocks install dkjson

local jsonFile = "./shape_hairstyle_map.json"
local inventory_path = "./inventory"

local shapes = {
    OVAL = "oval",
    ROUND = "round",
    OBLONG = "oblong",
    TRIANGLE = "triangle",
    SQUARE = "square",
    DIAMOND = "diamond",
    HEART = "heart"
}

local operations = { map = 1, unmap = 2, list = 3 }

-- returns a list of non-hidden items in a directory
local function list_directory(dir)
    local contents = {}
    for entity in lfs.dir(dir) do
        if not entity:match("^%.+$") then
            table.insert(contents, entity)
        end
    end
    return contents
end

-- returns decoded lua table of specified json file path
local function shape_map_decode(path)
    if not path then return end
    local file = io.open(path, "r")
    if not file then
        error("could not open " .. path)
    end
    local content = file:read("*a")
    file:close()

    local table, _, err = json.decode(content, 1, nil)
    if err then
        error("Err parsing JSON: " .. err)
    end
    return table
end

-- convert data to json document and saves it in path
local function shape_map_encode(path, data)
    if not data or not path then return end
    local file = io.open(path, "w")
    if not file then
        error("could not open " .. path)
    end
    local encodedJson = json.encode(data, { indent = true })
    file:write(encodedJson)
    file:close()
end

local function usage()
    print("\nUSAGE: " .. arg[0] .. " <operation> <shape> <hairstyle>")
    print("operation: {")
    for key, _ in pairs(operations) do
        print("\t" .. key)
    end
    print("}\nshapes: {")
    for _, shape in pairs(shapes) do
        print("\t" .. shape)
    end
    print("}")
end


local operation = operations[string.lower(arg[1] or "nil")]
local shape = shapes[string.upper(arg[2] or "nil")]
local hairstyle = arg[3]

if operation == operations.list then
    if not shape then
        print((shape or arg[2] or "nil") .. " is not a valid shape")
        usage()
    end
    goto end_of_arg_validation
end
-- this block validates and prints the errors
if not operation or not shape or not hairstyle then
    io.write("ERR: ")
    if not operation then
        print("invalid operation: " .. (operation or arg[1] or "nil"))
        goto exit
    end
    if not shape then
        print((shape or arg[2] or "nil") .. " is not a valid shape")
        goto exit
    end
    if not hairstyle then
        print("no hairstyle was specified")
        goto exit
    end
    :: exit ::
    usage()
    os.exit(1)
end

:: end_of_arg_validation ::

local function contains(array, key)
    for i, v in ipairs(array) do
      if v == key then
          return i
      end
    end
    return nil
end

-- inserts hairstyle into jsonFile, opens file manager in corresponding
-- directory if the hairstyle has no previous entry in inventory
local function map_hairstyle(shapeName, hairstyleName)
    local stylesheet = shape_map_decode(jsonFile)
    if not stylesheet then
        error("failed to decode the json file")
    end

    -- the block below inserts a hairstyle into the read json document.
    for _, shapeEntity in ipairs(stylesheet) do
        if shapeEntity.shape == shapeName then
            -- checking if shape in json doc already contains the hairstyle
            if not contains(shapeEntity.hairstyles, hairstyleName) then
                table.insert(shapeEntity.hairstyles, hairstyleName)
                print(hairstyleName .. " mapped to " .. shapeName .. " shape.")
                break
            else
                print(hairstyleName .. " already mapped to " .. shapeName .. " shape")
                print("no modifications were made.")
                os.exit(0)
            end
        end
    end
    shape_map_encode(jsonFile, stylesheet)

    local inventory_items = list_directory(inventory_path)
    if not contains(inventory_items, hairstyle) then
        lfs.mkdir(inventory_path .. "/" .. hairstyleName)
        os.execute("xdg-open " .. inventory_path .. "/" .. hairstyleName)
    end
end

local function unmap_hairstyle(shapeName, hairstyleName)
    local function is_last_entry(stylesheet)
        for _, shapeEntity in ipairs(stylesheet) do
            if contains(shapeEntity.hairstyles, hairstyleName) then
                return false
            end
        end
        return true
    end
    local stylesheet = shape_map_decode(jsonFile)
    if not stylesheet then
        error("failed to decode the json file")
    end
    for _, shapeEntity in ipairs(stylesheet) do
        if shapeEntity.shape == shapeName then
            local pos = contains(shapeEntity.hairstyles, hairstyleName)
            if pos then
                table.remove(shapeEntity.hairstyles, pos)
                print(hairstyleName .. " is unmapped from " .. shapeName .. " shape.")
                if is_last_entry(stylesheet) then
                    print(hairstyleName .. " is not mapped to any other shape.")
                    print("you can remove it using [ rm -rf " .. inventory_path .. "/" .. shapeName .. " ] manually.")
                end
                break;
            else
                print(hairstyleName .. " doesn't have a map to the shape " .. shapeName)
                print("no modifications were made.")
                os.exit(1)
            end
        end
    end
    shape_map_encode(jsonFile, stylesheet)
end

local function list_hairstyles(shapeName)
    local stylesheet = shape_map_decode(jsonFile)
    if not stylesheet then
        error("failed to decode the json file")
    end

    for _, shapeEntity in ipairs(stylesheet) do
        if shapeEntity.shape == shapeName then
            print(shapeName .. ": {")
            for _, styleName in ipairs(shapeEntity.hairstyles) do
                print("\t" .. styleName .. ",")
            end
            print("}")
        end
    end
end

-- shape and hairstyle is already defined above
if operation == operations.map then
    map_hairstyle(shape, hairstyle)
elseif operation == operations.unmap then
    unmap_hairstyle(shape, hairstyle)
elseif operation == operations.list then
    list_hairstyles(shape)
end
